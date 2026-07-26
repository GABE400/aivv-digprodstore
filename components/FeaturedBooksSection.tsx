"use client";

import React, { useState } from "react";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { BookCard } from "@/components/BookCard";
import { Sparkles, Filter, Check, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface FeaturedBooksSectionProps {
  onPreview: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  cartBookIds: string[];
}

export const FeaturedBooksSection: React.FC<FeaturedBooksSectionProps> = ({
  onPreview,
  onAddToCart,
  cartBookIds,
}) => {
  const { books } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { id: "all", name: "All Books" },
    { id: "tech-code", name: "Tech & Code" },
    { id: "design-creative", name: "Design & Creative" },
    { id: "business-strategy", name: "Business & Strategy" },
    { id: "mind-philosophy", name: "Mind & Philosophy" },
    { id: "sci-fi-speculative", name: "Sci-Fi & Speculative" },
  ];

  const filteredBooks =
    selectedCategory === "all"
      ? books
      : books.filter((b) => b.category === selectedCategory);

  return (
    <section id="browse" className="py-16 md:py-24 bg-[#faf8f5] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-900 text-stone-100 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Curated Selection ({books.length})</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Featured & Bestselling Ebooks
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              Instant in-browser preview on every title. Every purchase includes high-resolution PDF and EPUB downloads with zero DRM locks.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-stone-900 text-stone-50 shadow-sm"
                    : "bg-white text-stone-700 border border-[#e2dcd2] hover:bg-stone-100"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#e5decb] space-y-3">
            <ShoppingBag className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-stone-900">No Ebooks Found</h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto">
              No ebooks match this category yet. Upload new PDF and EPUB products via the Admin Dashboard!
            </p>
            <Link
              href="/admin/upload"
              className="inline-block px-4 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800"
            >
              Upload Ebook via Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onPreview={onPreview}
                onAddToCart={onAddToCart}
                isInCart={cartBookIds.includes(book.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
