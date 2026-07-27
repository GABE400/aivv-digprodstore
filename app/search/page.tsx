"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { BookCard } from "@/components/BookCard";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SignInModal } from "@/components/SignInModal";
import { Search, ArrowLeft, BookOpen, ShoppingBag, Star, Loader2 } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const { books } = useStore();

  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const filteredBooks = books.filter((book) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      book.title.toLowerCase().includes(q) ||
      book.author.toLowerCase().includes(q) ||
      book.synopsis.toLowerCase().includes(q) ||
      book.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const handleAddToCart = (book: Book) => {
    if (!cart.some((b) => b.id === book.id)) {
      setCart([...cart, book]);
      setCartOpen(true);
    } else {
      setCartOpen(true);
    }
  };

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
      {/* Search Bar Input Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-4">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Search Ebook Catalog
        </h1>
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search by title, author, keyword, or tag..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm text-stone-900 font-medium focus:outline-none focus:border-stone-900 shadow-xs"
          />
        </div>
        <p className="text-xs text-stone-500 font-mono">
          Showing {filteredBooks.length} results for "{query || "All"}"
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onPreview={(b) => setPreviewBook(b)}
            onAddToCart={handleAddToCart}
            isInCart={cart.some((item) => item.id === book.id)}
          />
        ))}
      </div>

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
    </main>
  );
}

export default function SearchResultsPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      <title>Search Ebooks | AIVV Store</title>
      <meta name="description" content="Search and discover premium ebooks in the AIVV Store catalog." />
      
      {/* Header */}
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
          </div>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          </div>
        }
      >
        <SearchContent />
      </Suspense>
    </div>
  );
}
