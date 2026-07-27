import { NextResponse } from "next/server";
import { sendNewsletterWelcomeEmail } from "@/lib/mailer";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL || "");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Ensure database table exists and persist subscription safely
    try {
      if (process.env.DATABASE_URL) {
        await sql`
          CREATE TABLE IF NOT EXISTS "newsletter_subscription" (
            "id" SERIAL PRIMARY KEY,
            "email" TEXT NOT NULL UNIQUE,
            "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
          );
        `;
        await sql`
          INSERT INTO "newsletter_subscription" ("email")
          VALUES (${cleanEmail})
          ON CONFLICT ("email") DO NOTHING;
        `;
      }
    } catch (dbErr) {
      console.warn("[Newsletter DB] Optional table insert failed, proceeding with email delivery:", dbErr);
    }

    // Send welcome email via Nodemailer
    const mailResult = await sendNewsletterWelcomeEmail({ to: cleanEmail });

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to The Reader's Edition!",
      mode: mailResult.mode,
    });
  } catch (error: any) {
    console.error("[Newsletter API Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to process subscription." },
      { status: 500 }
    );
  }
}
