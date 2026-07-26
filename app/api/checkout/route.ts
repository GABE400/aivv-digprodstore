import { NextRequest, NextResponse } from "next/server";
import { dodo } from "@/lib/dodo";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const amountStr = searchParams.get("amount");
    const bookId = searchParams.get("bookId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const userId = searchParams.get("userId");

    if (!productId || !amountStr || !bookId) {
      return NextResponse.json(
        { error: "Missing required parameters: productId, amount, or bookId" },
        { status: 400 }
      );
    }

    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount parameter" }, { status: 400 });
    }

    const returnUrl = process.env.DODO_PAYMENTS_RETURN_URL || "http://localhost:3000/checkout/success";

    // Create the Dodo checkout session dynamically using the client-specified amount
    const session = await dodo.checkoutSessions.create({
      product_cart: [
        {
          product_id: productId,
          quantity: 1,
          amount: amount, // Dynamic amount in lowest denomination (e.g. cents)
        },
      ],
      return_url: `${returnUrl}?bookId=${bookId}`,
      customer: {
        email: email || "customer@example.com",
        name: name || "Anonymous Reader",
      },
      metadata: {
        bookId: bookId,
        userId: userId || "",
        customAmount: amountStr,
      },
    });

    if (!session.checkout_url) {
      return NextResponse.json({ error: "Failed to generate checkout URL from Dodo Payments" }, { status: 500 });
    }

    // Redirect the browser to Dodo's hosted checkout
    return NextResponse.redirect(session.checkout_url);
  } catch (error: any) {
    console.error("Dodo Checkout Session Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during checkout creation" },
      { status: 500 }
    );
  }
}
