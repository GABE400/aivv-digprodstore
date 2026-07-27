"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SignInModal } from "@/components/SignInModal";
import {
  BookOpen,
  ShoppingBag,
  ArrowLeft,
  Star,
  CheckCircle2,
  Download,
  FileText,
  ShieldCheck,
  Share2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = params.id as string;
  const { books } = useStore();

  const book = books.find((b) => b.id === bookId);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  // If book not found, show a clear not-found state
  if (!book) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col items-center justify-center p-8 font-sans space-y-4">
        <title>Book Not Found | AIVV Store</title>
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
          <BookOpen className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">Book Not Found</h2>
        <p className="text-xs text-stone-600 font-mono max-w-sm text-center">
          The ebook with ID &ldquo;{bookId}&rdquo; could not be found in our catalog. It may have been removed or the link may be outdated.
        </p>
        <Link
          href="/books"
          className="px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Browse All Ebooks
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!cart.some((b) => b.id === book.id)) {
      setCart([...cart, book]);
      setCartOpen(true);
    } else {
      setCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      <title>{`${book.title} | AIVV Store Ebook`}</title>
      <meta name="description" content={book.synopsis} />
      
      {/* Navbar */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/books"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Ebooks
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-8 py-10 space-y-10">
        
        {/* Book Product Hero Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Large Book Cover Visual */}
          <div className="md:col-span-5 space-y-4">
            <div className="h-96 sm:h-[420px] rounded-3xl bg-gradient-to-br from-stone-900 via-amber-950 to-neutral-900 relative shadow-2xl border border-stone-800 overflow-hidden flex flex-col justify-between p-6 text-stone-100">
              {book.coverUrl ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}

              {/* Overlay badges and text */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-xs text-amber-400 uppercase font-bold px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-amber-500/20">
                  {book.category}
                </span>
                {book.badge && (
                  <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs shadow-sm">
                    {book.badge}
                  </span>
                )}
              </div>

              {!book.coverUrl && (
                <div className="relative z-10 space-y-2 my-auto">
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
                    {book.title}
                  </h1>
                  <p className="text-sm text-stone-300 italic">{book.subtitle || `By ${book.author}`}</p>
                </div>
              )}

              <div className="relative z-10 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-mono text-stone-200 bg-stone-950/40 p-2 rounded-xl backdrop-blur-xs">
                <span>{book.pages} PAGES</span>
                <span>{book.readingTime}</span>
              </div>
            </div>

            {/* Instant DRM-Free Download Guarantees Card */}
            <div className="p-4 rounded-2xl bg-white border border-[#e5decb] shadow-xs space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2 text-amber-800 font-bold font-mono">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>DRM-FREE GUARANTEE</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed">
                Includes instant browser reader access + permanent DRM-free PDF and EPUB downloads. Own forever across all your devices.
              </p>
            </div>
          </div>

          {/* Right Column: Book Details & Actions */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Title & Author */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{book.rating}</span>
                </div>
                <span className="text-xs font-mono text-stone-500">
                  ({book.reviewsCount} verified reader reviews)
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-snug">
                {book.title}
              </h1>
              <p className="text-sm font-semibold text-stone-600 mt-1">
                By <span className="text-stone-900 font-bold">{book.author}</span> · {book.authorRole}
              </p>
            </div>

            {/* Price & Primary CTA */}
            <div className="p-6 rounded-3xl bg-white border border-[#e5decb] shadow-sm space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-bold text-stone-900">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md ml-auto">
                  INSTANT ACCESS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-4 px-6 rounded-2xl bg-amber-500 text-stone-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Buy Ebook & Read Instantly
                </button>

                <button
                  onClick={() => setPreviewBook(book)}
                  className="py-4 px-6 rounded-2xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" /> Preview Chapter 1
                </button>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="font-serif text-xl font-bold text-stone-900">Synopsis</h3>
              <p className="text-sm text-stone-700 leading-relaxed font-sans">
                {book.synopsis}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {book.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-xl bg-stone-100 text-stone-700 text-xs font-mono font-semibold border border-stone-200">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Reader Preview Modal */}
        <ReaderModal
          book={previewBook}
          onClose={() => setPreviewBook(null)}
          onAddToCart={handleAddToCart}
        />

        {/* Cart Drawer */}
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          cartBooks={cart}
          onRemoveFromCart={(id) => setCart(cart.filter((b) => b.id !== id))}
          onOpenReader={(b) => setPreviewBook(b)}
          onClearCart={() => setCart([])}
          onOpenSignIn={() => setSignInModalOpen(true)}
        />

        {/* Sign In Modal */}
        <SignInModal
          isOpen={signInModalOpen}
          onClose={() => setSignInModalOpen(false)}
        />
      </main>
    </div>
  );
}
