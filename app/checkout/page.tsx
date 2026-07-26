"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ShoppingBag,
  FileText,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const { data: session } = authClient.useSession();
  const { books } = useStore();

  // Find book or default to featured book
  const selectedBook = books.find((b) => b.id === bookId) || books[0];

  const [email, setEmail] = useState(session?.user?.email || "reader@example.com");
  const [fullName, setFullName] = useState(session?.user?.name || "Alex Morgan");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("888");

  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = selectedBook.price;
  const taxes = 0; // Digital tax included
  const total = subtotal + taxes;

  const resolvedDodoId = selectedBook.dodoProductId && selectedBook.dodoProductId !== "pdt_default"
    ? selectedBook.dodoProductId
    : process.env.NEXT_PUBLIC_DODO_PRODUCT_ID || "";
  const hasDodoId = !!resolvedDodoId;

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedDodoId) {
      alert("This book doesn't have a Dodo Payments product ID configured yet.");
      return;
    }
    
    setIsProcessing(true);
    
    const priceInCents = Math.round(selectedBook.price * 100);
    const checkoutUrl = `/api/checkout?productId=${resolvedDodoId}&amount=${priceInCents}&bookId=${selectedBook.id}&email=${encodeURIComponent(email)}&name=${encodeURIComponent(fullName)}&userId=${session?.user?.id || ""}`;
    
    window.location.href = checkoutUrl;
  };

  return (
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Summary & Digital Delivery Guarantees */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-stone-900 border-b border-stone-100 pb-4">
              Order Summary
            </h2>

            {/* Selected Book Item Card */}
            <div className="flex gap-4 items-start">
              <div className="w-20 h-28 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 p-3 flex flex-col justify-between text-stone-100 shadow-md shrink-0 border border-stone-800">
                <span className="text-[9px] font-mono text-amber-400 uppercase font-bold truncate">
                  {selectedBook.category}
                </span>
                <h4 className="font-serif text-xs font-bold text-stone-100 line-clamp-2 leading-tight">
                  {selectedBook.title}
                </h4>
                <span className="text-[8px] text-stone-400 italic truncate">By {selectedBook.author}</span>
              </div>

              <div className="space-y-1.5 flex-1">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">
                  DIGITAL EBOOK
                </span>
                <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
                  {selectedBook.title}
                </h3>
                <p className="text-xs text-stone-500">By {selectedBook.author}</p>
                <div className="font-serif text-lg font-bold text-stone-900 pt-1">
                  ${selectedBook.price.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs font-mono">
              <div className="flex justify-between text-stone-600">
                <span>Ebook Price:</span>
                <span className="font-bold text-stone-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Physical Shipping:</span>
                <span className="font-bold text-emerald-700 uppercase">$0.00 (Instant Digital)</span>
              </div>
              <div className="flex justify-between text-stone-900 font-bold text-sm pt-2 border-t border-stone-200">
                <span>Total Amount:</span>
                <span className="font-serif text-xl text-stone-900">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Guarantees */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-900">
            <div className="flex items-center gap-2 font-bold font-mono text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>INSTANT DIGITAL UNLOCK GUARANTEE</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Upon successful payment, this book will be unlocked in your personal reader library for instant in-browser reading + permanent DRM-free PDF and EPUB downloads.
            </p>
          </div>
        </div>

        {/* Right Column: Checkout Payment Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-800 border border-stone-200 mb-2">
                <Lock className="w-3.5 h-3.5 text-stone-600" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Payment Details
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Complete your purchase via Dodo Payments or Credit/Debit card.
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-5">
              
              {/* Account Information */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase text-stone-500 font-bold">
                  1. Reader Account Information
                </h3>
                
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address (For Digital License Delivery)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-stone-100">
                {!hasDodoId && (
                  <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-center font-medium">
                    This book is missing a Dodo Product ID. Please set it in the admin catalog.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isProcessing || !hasDodoId}
                  className="w-full py-4 rounded-2xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting to Secure Checkout...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ${total.toFixed(2)} with Dodo Payments</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      <title>Secure Checkout | AIVV Store</title>
      <meta name="description" content="Securely complete your purchase via Dodo Payments on AIVV Store." />
      
      {/* Header Bar */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>
          <Link
            href="/books"
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Store
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}
