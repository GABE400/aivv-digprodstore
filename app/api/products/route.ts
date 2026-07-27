import { NextResponse } from "next/server";
import { db } from "@/db";
import { book } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BOOKS as INITIAL_BOOKS, Book } from "@/lib/data/books";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

// Ensure table exists helper
async function ensureTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS "book" (
        "id" text PRIMARY KEY,
        "title" text NOT NULL,
        "subtitle" text,
        "author" text NOT NULL,
        "author_role" text,
        "price" text NOT NULL,
        "original_price" text,
        "discount_percent" integer,
        "dodo_product_id" text,
        "rating" text DEFAULT '5.0',
        "reviews_count" integer DEFAULT 1,
        "pages" integer DEFAULT 250,
        "reading_time" text DEFAULT '5 hrs',
        "category" text NOT NULL,
        "tags" text,
        "badge" text,
        "formats" text DEFAULT 'PDF,EPUB',
        "pdf_url" text,
        "epub_url" text,
        "cover_url" text,
        "bg_gradient" text,
        "accent_color" text,
        "text_color" text,
        "pattern" text,
        "synopsis" text NOT NULL,
        "sample_chapters" text,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      );
    `;
  } catch (err) {
    console.error("Failed to ensure table 'book':", err);
  }
}

function parseChapters(raw: any) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }
  return [];
}

function parseTags(raw: any): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") return raw.split(",").map((t) => t.trim()).filter(Boolean);
  return [];
}

function parseFormats(raw: any): ("PDF" | "EPUB")[] {
  if (!raw) return ["PDF", "EPUB"];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") return raw.split(",").map((f) => f.trim()) as any;
  return ["PDF", "EPUB"];
}

// Convert DB row to Book object safely
function rowToBook(row: any): Book {
  const origPriceVal = row.originalPrice ?? row.original_price;
  const discPercentVal = row.discountPercent ?? row.discount_percent;
  const dodoIdVal = row.dodoProductId ?? row.dodo_product_id;
  const reviewsVal = row.reviewsCount ?? row.reviews_count;
  const readingTimeVal = row.readingTime ?? row.reading_time;
  const pdfVal = row.pdfUrl ?? row.pdf_url;
  const epubVal = row.epubUrl ?? row.epub_url;
  const coverVal = row.coverUrl ?? row.cover_url;
  const bgGradVal = row.bgGradient ?? row.bg_gradient;
  const accentVal = row.accentColor ?? row.accent_color;
  const textColVal = row.textColor ?? row.text_color;
  const authorRoleVal = row.authorRole ?? row.author_role;

  return {
    id: String(row.id),
    title: String(row.title || "Untitled Book"),
    subtitle: String(row.subtitle || ""),
    author: String(row.author || "Anonymous"),
    authorRole: authorRoleVal ? String(authorRoleVal) : "Author",
    price: typeof row.price === "number" ? row.price : parseFloat(row.price) || 24.99,
    originalPrice: origPriceVal ? parseFloat(origPriceVal) || undefined : undefined,
    discountPercent: discPercentVal ? parseInt(discPercentVal, 10) || undefined : undefined,
    dodoProductId: dodoIdVal ? String(dodoIdVal) : undefined,
    rating: typeof row.rating === "number" ? row.rating : parseFloat(row.rating) || 5.0,
    reviewsCount: reviewsVal ? parseInt(reviewsVal, 10) || 1 : 1,
    pages: typeof row.pages === "number" ? row.pages : parseInt(row.pages, 10) || 250,
    readingTime: readingTimeVal ? String(readingTimeVal) : "5 hrs",
    category: String(row.category || "tech-code"),
    tags: parseTags(row.tags),
    badge: row.badge ? (String(row.badge) as any) : undefined,
    formats: parseFormats(row.formats),
    // Omit raw pdfUrl and epubUrl from public API catalog output to prevent unauthenticated asset scraping.
    // Downloads are served securely via /api/download after validating ownership.
    pdfUrl: undefined,
    epubUrl: undefined,
    coverUrl: coverVal ? String(coverVal) : undefined,
    coverStyle: {
      bgGradient: bgGradVal ? String(bgGradVal) : "bg-gradient-to-br from-stone-900 to-stone-800",
      accentColor: accentVal ? String(accentVal) : "#f59e0b",
      textColor: textColVal ? String(textColVal) : "text-amber-400",
      pattern: (row.pattern as any) || "editorial",
    },
    synopsis: String(row.synopsis || ""),
    sampleChapters: parseChapters(row.sampleChapters ?? row.sample_chapters),
  };
}

// GET all books from DB with server-side & edge caching
export async function GET() {
  try {
    await ensureTable();
    const dbBooks = await db.select().from(book);

    // Format all books in DB
    const formattedBooks = dbBooks.map(rowToBook);
    return NextResponse.json(
      { success: true, books: formattedBooks, source: "db" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: true, books: [], source: "error" });
  }
}

// POST create a new book in DB
export async function POST(request: Request) {
  try {
    await ensureTable();
    const newBook: Book = await request.json();

    if (!newBook || !newBook.id || !newBook.title) {
      return NextResponse.json({ error: "Missing required product fields" }, { status: 400 });
    }

    const tagsStr = Array.isArray(newBook.tags) ? newBook.tags.join(",") : newBook.tags || "";
    const formatsStr = Array.isArray(newBook.formats) ? newBook.formats.join(",") : newBook.formats || "PDF,EPUB";
    const chaptersStr = JSON.stringify(newBook.sampleChapters || []);

    await sql`
      INSERT INTO "book" (
        "id", "title", "subtitle", "author", "author_role", "price", "original_price",
        "discount_percent", "dodo_product_id", "rating", "reviews_count", "pages",
        "reading_time", "category", "tags", "badge", "formats", "pdf_url", "epub_url",
        "cover_url", "bg_gradient", "accent_color", "text_color", "pattern", "synopsis",
        "sample_chapters", "updated_at"
      ) VALUES (
        ${newBook.id}, ${newBook.title}, ${newBook.subtitle || ""}, ${newBook.author},
        ${newBook.authorRole || ""}, ${newBook.price.toString()}, ${newBook.originalPrice ? newBook.originalPrice.toString() : null},
        ${newBook.discountPercent || null}, ${newBook.dodoProductId || null}, ${newBook.rating ? newBook.rating.toString() : "5.0"},
        ${newBook.reviewsCount || 1}, ${newBook.pages || 250}, ${newBook.readingTime || "5 hrs"},
        ${newBook.category}, ${tagsStr},
        ${newBook.badge || null}, ${formatsStr},
        ${newBook.pdfUrl || null}, ${newBook.epubUrl || null}, ${newBook.coverUrl || null},
        ${newBook.coverStyle?.bgGradient || null}, ${newBook.coverStyle?.accentColor || null},
        ${newBook.coverStyle?.textColor || null}, ${newBook.coverStyle?.pattern || null},
        ${newBook.synopsis || ""}, ${chaptersStr}, NOW()
      )
      ON CONFLICT ("id") DO UPDATE SET
        "title" = EXCLUDED."title",
        "subtitle" = EXCLUDED."subtitle",
        "author" = EXCLUDED."author",
        "price" = EXCLUDED."price",
        "cover_url" = EXCLUDED."cover_url",
        "synopsis" = EXCLUDED."synopsis",
        "updated_at" = NOW();
    `;

    return NextResponse.json({ success: true, book: newBook });
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}

// DELETE a book or clear all books from DB
export async function DELETE(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get("id");
    const clearAll = searchParams.get("clearAll");

    if (clearAll === "true") {
      await sql`DELETE FROM "book"`;
      return NextResponse.json({ success: true, message: "Cleared all products" });
    }

    if (bookId) {
      await db.delete(book).where(eq(book.id, bookId));
      return NextResponse.json({ success: true, message: `Deleted book ${bookId}` });
    }

    return NextResponse.json({ error: "Missing bookId or clearAll parameter" }, { status: 400 });
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}

// PUT update a book in DB
export async function PUT(request: Request) {
  try {
    await ensureTable();
    const updatedBook: Book = await request.json();

    if (!updatedBook || !updatedBook.id) {
      return NextResponse.json({ error: "Missing book id" }, { status: 400 });
    }

    await db
      .update(book)
      .set({
        title: updatedBook.title,
        subtitle: updatedBook.subtitle || "",
        author: updatedBook.author,
        authorRole: updatedBook.authorRole || "",
        price: updatedBook.price.toString(),
        originalPrice: updatedBook.originalPrice ? updatedBook.originalPrice.toString() : null,
        discountPercent: updatedBook.discountPercent || null,
        dodoProductId: updatedBook.dodoProductId || null,
        badge: updatedBook.badge || null,
        coverUrl: updatedBook.coverUrl || null,
        synopsis: updatedBook.synopsis,
        updatedAt: new Date(),
      })
      .where(eq(book.id, updatedBook.id));

    return NextResponse.json({ success: true, book: updatedBook });
  } catch (error: any) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}
