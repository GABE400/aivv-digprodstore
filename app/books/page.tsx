"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book, CATEGORIES } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SignInModal } from "@/components/SignInModal";
import { Search, Filter, BookOpen, ShoppingBag, ArrowLeft, Star, Check } from "lucide-react";

export default function BooksDirectoryPage() {
  const { books } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const handleAddToCart = (book: Book) => {
    if (!cart.some((b) => b.id === book.id)) {
      setCart([...cart, book]);
    } else {
      setCartOpen(true);
    }
  };

  // Filter & sort logic
  let filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") filteredBooks.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filteredBooks.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filteredBooks.sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
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
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-3">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
            COMPLETE EBOOK STORE CATALOG
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">
            Explore All Ebooks ({filteredBooks.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Read instantly in your browser or download DRM-free EPUB & PDF files. Premium editorial books for modern builders and thinkers.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e5decb] shadow-xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === "all"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              All Categories ({books.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-amber-400 shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search & Sorting */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search titles, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Ebook Catalog Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e5decb] space-y-3 font-mono text-xs text-stone-500">
            No ebooks match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  {/* Book Cover Visual */}
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-stone-900 via-amber-950 to-neutral-900 p-5 flex flex-col justify-between text-stone-100 relative overflow-hidden group-hover:scale-[1.01] transition-transform">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-[10px] text-amber-400 uppercase font-bold px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs">
                        {book.category}
                      </span>
                      <div className="flex items-center gap-1 bg-amber-400/20 px-2 py-0.5 rounded text-amber-300 font-bold text-[10px]">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-xl font-bold leading-snug text-stone-100 line-clamp-2">
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
                    <p className="text-xs text-stone-500 font-medium">By {book.author}</p>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-serif text-xl font-bold text-stone-900">
                      ${book.price.toFixed(2)}
                    </span>
                    {book.originalPrice && (
                      <span className="text-xs text-stone-400 line-through ml-1.5">
                        ${book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewBook(book)}
                      className="px-3 py-2 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-stone-600" /> Preview
                    </button>

                    <button
                      onClick={() => handleAddToCart(book)}
                      className="px-3 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>Buy</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reader Modal */}
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

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
