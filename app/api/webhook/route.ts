import { Webhooks } from "@dodopayments/nextjs";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onPaymentSucceeded: async (payload) => {
    const metadata = payload.data?.metadata as Record<string, string | undefined> | undefined;
    let targetUserId = metadata?.userId;
    const bookId = metadata?.bookId;

    if (!targetUserId && payload.data?.customer?.email) {
      try {
        const usersByEmail = await db
          .select()
          .from(user)
          .where(eq(user.email, payload.data.customer.email));
        if (usersByEmail.length > 0) {
          targetUserId = usersByEmail[0].id;
        }
      } catch (lookupErr) {
        console.warn("Failed user lookup by email in webhook:", lookupErr);
      }
    }

    if (targetUserId && bookId) {
      try {
        const users = await db.select().from(user).where(eq(user.id, targetUserId));
        if (users.length > 0) {
          const u = users[0];
          const owned = u.ownedBooks
            ? u.ownedBooks.split(",").map((s: string) => s.trim()).filter(Boolean)
            : [];
          if (!owned.includes(bookId)) {
            owned.push(bookId);
            await db
              .update(user)
              .set({ ownedBooks: owned.join(",") })
              .where(eq(user.id, targetUserId));
            console.log(`Successfully granted access to book ${bookId} for user ${targetUserId}`);
          }
        }
      } catch (err) {
        console.error("Failed to update user owned books in database:", err);
      }
    }
  },
  onPaymentFailed: async (payload) => {
    console.log("Payment Failed:", payload);
  }
});
