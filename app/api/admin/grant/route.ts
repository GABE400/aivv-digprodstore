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

    const userRole = (session?.user as { role?: string } | undefined)?.role;
    if (!session?.user || userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, bookId } = body;

    if (!email || !bookId) {
      return NextResponse.json(
        { error: "Missing required fields: email and bookId" },
        { status: 400 }
      );
    }

    const targetUsers = await db.select().from(user).where(eq(user.email, email.trim()));

    if (!targetUsers || targetUsers.length === 0) {
      return NextResponse.json(
        { error: `User with email "${email}" not found. Ask them to create an account first.` },
        { status: 404 }
      );
    }

    const targetUser = targetUsers[0];
    const existingOwned = targetUser.ownedBooks
      ? targetUser.ownedBooks.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!existingOwned.includes(bookId)) {
      existingOwned.push(bookId);
      await db
        .update(user)
        .set({ ownedBooks: existingOwned.join(",") })
        .where(eq(user.id, targetUser.id));
    }

    return NextResponse.json({
      success: true,
      message: `Granted book license to ${email}`,
      ownedBooks: existingOwned,
    });
  } catch (error) {
    console.error("[Admin Grant API] Error:", error);
    return NextResponse.json(
      { error: "Failed to grant book access" },
      { status: 500 }
    );
  }
}
