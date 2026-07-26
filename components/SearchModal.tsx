"use client";

import React, { useState } from "react";
import { Book, BOOKS } from "@/lib/data/books";
import { Search, X, BookOpen, Star, ShoppingBag } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onPreview,
  onAddToCart,
}) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const results = query.trim()
    ? BOOKS.filter(
        (b) =>
          b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()) ||
          b.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : BOOKS.slice(0, 3); // Top 3 as suggestions when empty

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-stone-950/70 backdrop-blur-xs">
      <div className="bg-[#faf8f5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#e5decb] overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Header */}
        <div className="p-4 bg-white border-b border-[#e5decb] flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-700 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search by title, author, topic (e.g. 'Typography', 'Architecture')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-3">
          <div className="text-[11px] font-mono uppercase text-stone-400 px-2">
            {query.trim() ? `Search Results (${results.length})` : "Recommended Ebooks"}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs font-medium">
              No ebooks found matching "{query}". Try searching for 'Design', 'Code', or 'Strategy'.
            </div>
          ) : (
            results.map((book) => (
              <div
                key={book.id}
                className="bg-white p-3 rounded-xl border border-stone-200 hover:border-amber-400 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-14 bg-stone-900 rounded shrink-0 p-1 flex flex-col justify-between book-spine-effect">
                    <span className="text-[7px] text-amber-400 font-mono">AIVV</span>
                    <span className="text-[8px] text-white font-serif line-clamp-2 leading-tight">
                      {book.title}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-serif text-sm font-bold text-stone-900 truncate">
                      {book.title}
                    </h4>
                    <p className="text-xs text-stone-500 italic">By {book.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                        {book.category}
                      </span>
                      <span className="text-xs font-bold text-stone-900">${book.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onPreview(book);
                      onClose();
                    }}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg text-xs"
                    title="Preview Reader"
                  >
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      onAddToCart(book);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800"
                  >
                    Buy
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
