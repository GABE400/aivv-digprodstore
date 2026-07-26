"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES, BOOKS } from "@/lib/data/books";
import { Logo } from "@/components/Logo";
import { ArrowLeft, BookOpen, Layers, Sparkles, ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>
          <Link
            href="/books"
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Ebooks Directory
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-8">
        
        {/* Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 space-y-3">
          <span className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
            EDITORIAL TOPIC COLLECTIONS
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold">
            Ebook Categories ({CATEGORIES.length})
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
            Discover curated digital titles organized by subject matter—from software architecture to typography and philosophy.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold font-mono">
                    <Layers className="w-6 h-6 text-amber-800" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-800 font-mono text-xs font-bold border border-stone-200">
                    {cat.count} {cat.count === 1 ? "Book" : "Books"}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                <span>Browse {cat.name} Collection</span>
                <ArrowRight className="w-4 h-4 text-amber-600" />
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
