import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { book as bookTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BOOKS as INITIAL_BOOKS } from "@/lib/data/books";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("bookId");
    const format = (searchParams.get("format") || "pdf").toLowerCase();

    if (!bookId) {
      return NextResponse.json({ error: "Missing bookId parameter" }, { status: 400 });
    }

    // 1. Verify user session server-side via Better Auth
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required to download digital products" },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role || "user";
    const ownedBooksString = (session.user as any).ownedBooks || "";
    const ownedBookIds = ownedBooksString ? ownedBooksString.split(",") : [];

    const isOwned = ownedBookIds.includes(bookId);
    const isAdmin = userRole === "admin";

    // 2. Enforce purchase ownership check
    if (!isOwned && !isAdmin) {
      return NextResponse.json(
        { error: "Purchase required to download this e-book" },
        { status: 403 }
      );
    }

    // 3. Retrieve target file URL from PostgreSQL or fallback catalog
    let fileUrl: string | undefined;

    try {
      if (process.env.DATABASE_URL) {
        const dbResult = await db.select().from(bookTable).where(eq(bookTable.id, bookId));
        if (dbResult && dbResult[0]) {
          const row = dbResult[0];
          fileUrl = format === "epub" ? (row.epubUrl || undefined) : (row.pdfUrl || undefined);
        }
      }
    } catch (dbErr) {
      console.warn("[Download API] DB lookup error, checking fallback catalog:", dbErr);
    }

    if (!fileUrl) {
      const fallbackBook = INITIAL_BOOKS.find((b) => b.id === bookId);
      if (fallbackBook) {
        fileUrl = format === "epub" ? fallbackBook.epubUrl : fallbackBook.pdfUrl;
      }
    }

    if (!fileUrl) {
      return NextResponse.json(
        { error: `Requested ${format.toUpperCase()} file is not available for this title` },
        { status: 404 }
      );
    }

    // 4. Securely redirect to the asset URL
    return NextResponse.redirect(fileUrl);
  } catch (error: any) {
    console.error("[Download API Error]", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process download request" },
      { status: 500 }
    );
  }
}
