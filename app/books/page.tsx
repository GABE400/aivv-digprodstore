"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book, CATEGORIES } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Navbar } from "@/components/Navbar";
import { BookCard } from "@/components/BookCard";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { SignInModal } from "@/components/SignInModal";
import { authClient } from "@/lib/auth-client";
import { Search, Filter, Sparkles, BookOpen, ShoppingBag, ArrowLeft, X } from "lucide-react";

export default function BooksDirectoryPage() {
  const { books } = useStore();
  const { data: session } = authClient.useSession();
  const userRole = (session?.user as any)?.role || "user";

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [cart, setCart] = useState<Book[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const handleAddToCart = (book: Book) => {
    if (!cart.some((b) => b.id === book.id)) {
      setCart((prev) => [...prev, book]);
      setCartOpen(true);
    } else {
      setCartOpen(true);
    }
  };

  // Filter & sort logic
  let filteredBooks = books.filter((book) => {
    const matchesCategory = selectedCategory === "all" || book.category === selectedCategory;
    const matchesSearch =
      !searchTerm.trim() ||
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (sortBy === "price-low") filteredBooks.sort((a, b) => a.price - b.price);
  if (sortBy === "price-high") filteredBooks.sort((a, b) => b.price - a.price);
  if (sortBy === "rating") filteredBooks.sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans selection:bg-[#f3ead8]">
      <title>Ebook Catalog & Store | AIVV Store</title>
      <meta name="description" content="Browse our complete collection of digital e-books. Instant in-browser reader + DRM-free downloads." />

      {/* Global Navbar */}
      <Navbar
        cartCount={cart.length}
        userRole={userRole}
        onToggleRole={() => {}}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSignIn={() => setSignInModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-10 border border-stone-800 space-y-3 relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>EDITORIAL EBOOK STORE CATALOG</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold leading-tight">
            Explore All Ebooks ({filteredBooks.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Read instantly in your browser tab or download permanent DRM-free EPUB & PDF files. Curated masterclasses for developers, designers, and founders.
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-stone-300 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Instant Browser Reader
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              PDF + EPUB Included
            </span>
          </div>
        </div>

        {/* Filter & Search Bar Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#e5decb] shadow-xs">
          
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-amber-400 shadow-sm"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search titles, authors, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Ebook Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e5decb] space-y-4 font-mono text-xs text-stone-500 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <p>No ebooks match your current search or category filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchTerm("");
              }}
              className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors"
            >
              Reset Filters & View All
            </button>
          </div>
        ) : (
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
        )}
      </main>

      {/* Global Modals & Drawers */}
      <ReaderModal
        book={previewBook}
        onClose={() => setPreviewBook(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartBooks={cart}
        onRemoveFromCart={(id) => setCart((prev) => prev.filter((b) => b.id !== id))}
        onOpenReader={(b) => setPreviewBook(b)}
        onClearCart={() => setCart([])}
        onOpenSignIn={() => setSignInModalOpen(true)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onPreview={(b) => setPreviewBook(b)}
        onAddToCart={handleAddToCart}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />
    </div>
  );
}
