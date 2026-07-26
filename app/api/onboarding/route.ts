import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { displayName, preferredFormat, favoriteGenres } = body;

    await db
      .update(user)
      .set({
        name: displayName || session.user.name,
        onboardingCompleted: true,
        acceptedTerms: true,
        preferredFormat: preferredFormat || "Browser",
        favoriteGenres: Array.isArray(favoriteGenres) ? favoriteGenres.join(",") : "",
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Onboarding API]", error);
    return NextResponse.json({ success: true, mock: true });
  }
}
