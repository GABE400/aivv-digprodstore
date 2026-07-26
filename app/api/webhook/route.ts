import { Webhooks } from "@dodopayments/nextjs";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST = Webhooks({
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY!,
  onPaymentSucceeded: async (payload) => {
    console.log("Payment Succeeded:", payload);
    const metadata = payload.data.metadata;
    const userId = metadata?.userId;
    const bookId = metadata?.bookId;

    if (userId && bookId) {
      try {
        const users = await db.select().from(user).where(eq(user.id, userId));
        if (users.length > 0) {
          const u = users[0];
          const owned = u.ownedBooks ? u.ownedBooks.split(",") : [];
          if (!owned.includes(bookId)) {
            owned.push(bookId);
            await db
              .update(user)
              .set({ ownedBooks: owned.join(",") })
              .where(eq(user.id, userId));
            console.log(`Successfully granted access to book ${bookId} for user ${userId}`);
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
