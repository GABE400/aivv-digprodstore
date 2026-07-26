"use client";

import React from "react";
import { Book } from "@/lib/data/books";
import { Star, BookOpen, Download, ShoppingBag, Eye } from "lucide-react";

interface BookCardProps {
  book: Book;
  onPreview: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  isInCart?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPreview,
  onAddToCart,
  isInCart = false,
}) => {
  return (
    <div className="group relative flex flex-col bg-white rounded-2xl p-4 border border-[#e8e2d9] transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Book Cover Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-stone-900 shadow-book group-hover:shadow-book-hover transition-all duration-300 book-spine-effect">
        {/* Badge */}
        {book.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-amber-500/90 text-stone-950 backdrop-blur-md shadow-sm">
              {book.badge}
            </span>
          </div>
        )}

        {/* Formats Tag */}
        <div className="absolute top-3 right-3 z-20 flex gap-1">
          {book.formats.map((fmt) => (
            <span
              key={fmt}
              className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded bg-stone-950/70 text-stone-200 border border-stone-700/50 backdrop-blur-sm"
            >
              {fmt}
            </span>
          ))}
        </div>

        {/* Dynamic Cover Artwork */}
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full ${book.coverStyle.bgGradient} p-6 flex flex-col justify-between relative`}>
            {/* Subtle grid accent overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

            {/* Top cover title & author preview */}
            <div className="relative z-10 space-y-2">
              <span className="text-[11px] font-mono tracking-widest uppercase text-stone-400 block opacity-80">
                AIVV EDITIONS
              </span>
              <h4 className="font-serif text-xl sm:text-2xl font-bold leading-tight text-stone-100 group-hover:text-white transition-colors">
                {book.title}
              </h4>
              <p className="text-xs text-stone-300 font-medium line-clamp-1">
                {book.subtitle}
              </p>
            </div>

            {/* Bottom cover author & page count */}
            <div className="relative z-10 pt-4 border-t border-stone-700/40 flex justify-between items-end">
              <div>
                <p className="text-xs font-serif italic text-stone-300">By {book.author}</p>
                <p className="text-[10px] text-stone-400 mt-0.5">{book.pages} pages · {book.readingTime}</p>
              </div>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center opacity-80"
                style={{ backgroundColor: book.coverStyle.accentColor }}
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-950" />
              </div>
            </div>
          </div>
        )}

        {/* Hover overlay quick preview button */}
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30 flex items-center justify-center gap-3 p-4">
          <button
            onClick={() => onPreview(book)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium bg-white text-stone-900 hover:bg-stone-100 shadow-md transition-transform transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            Preview Book
          </button>
        </div>
      </div>

      {/* Book Metadata below cover */}
      <div className="mt-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/60">
              {book.tags[0]}
            </span>
            <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{book.rating}</span>
              <span className="text-stone-400 text-[11px]">({book.reviewsCount})</span>
            </div>
          </div>

          <h3 className="mt-2.5 font-serif text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {book.title}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {book.synopsis}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-stone-900">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(book)}
              title="Read Sample Preview"
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            <button
              onClick={() => onAddToCart(book)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isInCart
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-sm"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isInCart ? "In Cart" : "Buy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
