"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
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
          <div
            key={book.id}
            className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="h-44 rounded-2xl bg-gradient-to-br from-stone-900 to-amber-950 p-5 flex flex-col justify-between text-stone-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded text-amber-300 font-bold text-[10px]">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{book.rating}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold leading-snug line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 italic">By {book.author}</p>
                </div>
              </div>

              <div>
                <Link href={`/books/${book.id}`} className="hover:underline">
                  <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                    {book.title}
                  </h3>
                </Link>
                <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                  {book.synopsis}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
              <span className="font-serif text-xl font-bold text-stone-900">
                ${book.price.toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewBook(book)}
                  className="px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200"
                >
                  <BookOpen className="w-3.5 h-3.5 text-stone-600" /> Preview
                </button>
                <button
                  onClick={() => handleAddToCart(book)}
                  className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
                >
                  Buy
                </button>
              </div>
            </div>
          </div>
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
