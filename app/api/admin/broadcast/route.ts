import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, book as bookTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { sendNewBookReleaseEmail } from "@/lib/mailer";
import { BOOKS, Book } from "@/lib/data/books";

const sql = neon(process.env.DATABASE_URL || "");

export async function POST(request: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      bookId,
      bookData,
      targetAudience = "all", // "all" | "genre-matched" | "test"
      testEmail,
    } = body;

    // 1. Resolve the book
    let targetBook: Book | null = null;
    if (bookData && typeof bookData === "object" && bookData.title) {
      targetBook = bookData as Book;
    } else if (bookId) {
      // Look in Postgres book table first
      try {
        const foundRows = await db.select().from(bookTable).where(eq(bookTable.id, bookId));
        if (foundRows && foundRows.length > 0) {
          const row = foundRows[0];
          targetBook = {
            id: String(row.id),
            title: String(row.title),
            subtitle: row.subtitle || "",
            author: String(row.author),
            authorRole: row.authorRole || "Author",
            price: typeof row.price === "number" ? row.price : parseFloat(String(row.price)) || 24.99,
            originalPrice: row.originalPrice ? parseFloat(String(row.originalPrice)) : undefined,
            discountPercent: row.discountPercent ? Number(row.discountPercent) : undefined,
            dodoProductId: row.dodoProductId || undefined,
            rating: typeof row.rating === "number" ? row.rating : parseFloat(String(row.rating)) || 5.0,
            reviewsCount: row.reviewsCount ? Number(row.reviewsCount) : 1,
            pages: row.pages ? Number(row.pages) : 250,
            readingTime: row.readingTime || "5 hrs",
            category: row.category || "tech-code",
            tags: row.tags ? row.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            badge: row.badge ? (row.badge as Book["badge"]) : undefined,
            formats: ["PDF", "EPUB"],
            coverUrl: row.coverUrl || undefined,
            coverStyle: {
              bgGradient: row.bgGradient || "bg-gradient-to-br from-stone-900 to-stone-800",
              accentColor: row.accentColor || "#f59e0b",
              textColor: row.textColor || "text-amber-400",
              pattern: "editorial",
            },
            synopsis: row.synopsis || "",
            sampleChapters: (() => {
              if (!row.sampleChapters) return [];
              try {
                return JSON.parse(row.sampleChapters);
              } catch {
                return [];
              }
            })(),
          };
        }
      } catch (err) {
        console.warn("[Broadcast] DB book lookup failed, checking static list:", err);
      }

      // Fallback to static BOOKS list
      if (!targetBook) {
        const found = BOOKS.find((b) => b.id === bookId);
        if (found) targetBook = found;
      }
    }

    if (!targetBook) {
      return NextResponse.json(
        { success: false, error: "Book not found. Provide a valid bookId or bookData." },
        { status: 404 }
      );
    }

    // 2. Handle Test Broadcast
    if (targetAudience === "test") {
      const destination =
        testEmail && typeof testEmail === "string" && testEmail.includes("@")
          ? testEmail.trim().toLowerCase()
          : session.user.email?.toLowerCase();

      if (!destination) {
        return NextResponse.json(
          { success: false, error: "No destination email provided for test email." },
          { status: 400 }
        );
      }

      const result = await sendNewBookReleaseEmail({
        to: destination,
        book: targetBook,
        isTest: true,
      });

      return NextResponse.json({
        success: true,
        message: `Test email dispatched to ${destination}`,
        sentCount: 1,
        failedCount: 0,
        recipients: [destination],
        mode: result.mode,
      });
    }

    // 3. Handle Full or Genre-Matched Broadcast
    const emailSet = new Set<string>();

    // A. Query Registered Users
    try {
      const registeredUsers = await db.select().from(user);
      const targetCategory = (targetBook.category || "").toLowerCase();

      for (const u of registeredUsers) {
        if (!u.email || !u.email.includes("@")) continue;
        const normalizedEmail = u.email.trim().toLowerCase();

        if (targetAudience === "genre-matched") {
          const userGenres = (u.favoriteGenres || "")
            .split(",")
            .map((g) => g.trim().toLowerCase())
            .filter(Boolean);

          // If user configured genres, filter strictly; if empty, include them
          if (userGenres.length > 0 && !userGenres.includes(targetCategory)) {
            continue;
          }
        }

        emailSet.add(normalizedEmail);
      }
    } catch (userErr) {
      console.warn("[Broadcast] Failed to query user table:", userErr);
    }

    // B. Query Newsletter Subscribers
    try {
      if (process.env.DATABASE_URL) {
        const subscribers = await sql`
          SELECT "email" FROM "newsletter_subscription" LIMIT 1000;
        `;
        if (Array.isArray(subscribers)) {
          for (const sub of subscribers) {
            const rawEmail = (sub as { email?: string })?.email;
            if (rawEmail && rawEmail.includes("@")) {
              emailSet.add(rawEmail.trim().toLowerCase());
            }
          }
        }
      }
    } catch (newsErr) {
      console.warn("[Broadcast] Failed to query newsletter_subscription:", newsErr);
    }

    const recipients = Array.from(emailSet);

    if (recipients.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No registered readers or newsletter subscribers found matching criteria.",
        sentCount: 0,
        failedCount: 0,
        recipients: [],
      });
    }

    // 4. Batch Dispatch in chunks of 10 to avoid serverless timeouts
    const BATCH_SIZE = 10;
    let sentCount = 0;
    let failedCount = 0;

    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
      const batch = recipients.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.allSettled(
        batch.map((to) =>
          sendNewBookReleaseEmail({
            to,
            book: targetBook!,
            isTest: false,
          })
        )
      );

      batchResults.forEach((res) => {
        if (res.status === "fulfilled" && res.value.success) {
          sentCount++;
        } else {
          failedCount++;
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Email broadcast dispatched to ${sentCount} recipient(s).`,
      sentCount,
      failedCount,
      totalTargeted: recipients.length,
    });
  } catch (error: unknown) {
    console.error("[Broadcast API Error]", error);
    const msg = error instanceof Error ? error.message : "Internal broadcast error";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
