import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const reqHeaders = await headers();
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to claim your purchase." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { bookId } = body;

    if (!bookId || typeof bookId !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing bookId" },
        { status: 400 }
      );
    }

    const userId = session.user.id;
    const users = await db.select().from(user).where(eq(user.id, userId));

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "User record not found" },
        { status: 404 }
      );
    }

    const currentUser = users[0];
    const existingOwned = currentUser.ownedBooks
      ? currentUser.ownedBooks.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!existingOwned.includes(bookId)) {
      existingOwned.push(bookId);
      await db
        .update(user)
        .set({ ownedBooks: existingOwned.join(",") })
        .where(eq(user.id, userId));
    }

    return NextResponse.json({
      success: true,
      bookId,
      ownedBooks: existingOwned,
    });
  } catch (error) {
    console.error("[Claim API] Error claiming purchase:", error);
    return NextResponse.json(
      { error: "Internal server error claiming purchase" },
      { status: 500 }
    );
  }
}
