"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CATEGORIES, Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { BookCard } from "@/components/BookCard";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SignInModal } from "@/components/SignInModal";
import { ArrowLeft, BookOpen, ShoppingBag, Star, Layers } from "lucide-react";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { books } = useStore();

  const categoryInfo = CATEGORIES.find((c) => c.id === slug) || {
    id: slug,
    name: slug.replace("-", " ").toUpperCase(),
    description: "Curated ebooks in this topic.",
    count: 0,
  };

  const categoryBooks = books.filter((b) => b.category === slug || slug === "all");
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const handleAddToCart = (book: Book) => {
    if (!cart.some((b) => b.id === book.id)) {
      setCart([...cart, book]);
      setCartOpen(true);
    } else {
      setCartOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      <title>{`${categoryInfo.name} Ebooks | AIVV Store`}</title>
      <meta name="description" content={categoryInfo.description} />
      
      {/* Header */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/categories"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Categories
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        {/* Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-10 border border-stone-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <Layers className="w-4 h-4" />
            <span>CATEGORY COLLECTION</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            {categoryInfo.name} ({categoryBooks.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            {categoryInfo.description}
          </p>
        </div>

        {/* Ebook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onPreview={(b) => setPreviewBook(b)}
              onAddToCart={handleAddToCart}
              isInCart={cart.some((item) => item.id === book.id)}
            />
          ))}
        </div>
      </main>

      <ReaderModal
        book={previewBook}
        onClose={() => setPreviewBook(null)}
        onAddToCart={handleAddToCart}
      />
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartBooks={cart}
        onRemoveFromCart={(id) => setCart(cart.filter((b) => b.id !== id))}
        onOpenReader={(b) => setPreviewBook(b)}
        onClearCart={() => setCart([])}
        onOpenSignIn={() => setSignInModalOpen(true)}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
