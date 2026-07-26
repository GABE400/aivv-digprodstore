"use client";

import React, { useState } from "react";
import { Book, HERO_COPY_PAIRS } from "@/lib/data/books";
import { BookOpen, Download, ArrowRight, ShieldCheck, Zap } from "lucide-react";

interface HeroSectionProps {
  featuredBook: Book;
  onPreview: (book: Book) => void;
  onAddToCart: (book: Book) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  featuredBook,
  onPreview,
  onAddToCart,
}) => {
  const [selectedHeadlineIdx, setSelectedHeadlineIdx] = useState<number>(0);
  const [readingProgress, setReadingProgress] = useState<number>(42);
  const [readerTheme, setReaderTheme] = useState<"sepia" | "light" | "dark">("sepia");

  const currentHeadline = HERO_COPY_PAIRS[selectedHeadlineIdx];

  const readerThemeClasses = {
    sepia: "bg-[#fbf7ee] text-[#2c2416] border-[#e8dfc8]",
    light: "bg-white text-stone-900 border-stone-200",
    dark: "bg-[#161614] text-[#e5e5e0] border-stone-800",
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden border-b border-[#e8e2d9] bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Headline Variant Selector */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-wider mr-1">
                Headline Option:
              </span>
              {HERO_COPY_PAIRS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedHeadlineIdx(idx)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedHeadlineIdx === idx
                      ? "bg-amber-100 text-amber-900 border border-amber-300 font-semibold shadow-xs"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200 border border-transparent"
                  }`}
                >
                  Option {idx + 1}
                </button>
              ))}
            </div>

            {/* Editorial Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12]">
              {currentHeadline.headlineMain} <br className="hidden sm:inline" />
              <span className="italic font-normal text-amber-800">{currentHeadline.headlineAccent}</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed font-sans">
              {currentHeadline.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#browse"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-stone-50 font-semibold text-sm hover:bg-stone-800 transition-all shadow-md active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Browse the Store
                <ArrowRight className="w-4 h-4 ml-1" />
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3.5 text-stone-800 font-semibold text-sm hover:text-amber-800 underline decoration-amber-300 underline-offset-4 transition-colors"
              >
                See how it works
              </a>
            </div>

            {/* Key Value Highlights */}
            <div className="pt-6 border-t border-[#e8e2d9] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-stone-600">
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-700 shrink-0" />
                <span>PDF & EPUB</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                <span>No physical shipping</span>
              </div>
            </div>
          </div>

          {/* Right Column - In-Browser Mock Reader Visual */}
          <div className="lg:col-span-6 relative">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#e2dcd2] shadow-2xl relative">
              
              {/* Browser Header */}
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-3 mb-4 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/90 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/90 inline-block" />
                  <span className="text-stone-400 ml-2 hidden sm:inline text-[11px]">
                    https://reader.aivv.app/read
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-[11px]">
                  <button
                    onClick={() => setReaderTheme("sepia")}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      readerTheme === "sepia" ? "bg-[#fbf7ee] text-amber-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => setReaderTheme("light")}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      readerTheme === "light" ? "bg-white text-stone-900 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setReaderTheme("dark")}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      readerTheme === "dark" ? "bg-stone-950 text-stone-100 shadow-xs" : "text-stone-500"
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>

              {/* Reader Mock Canvas */}
              <div className={`rounded-2xl p-6 border shadow-inner transition-colors duration-300 ${readerThemeClasses[readerTheme]}`}>
                <div className="flex items-center justify-between text-[11px] font-sans pb-3 mb-4 border-b border-current/10 opacity-70">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="font-bold">{featuredBook.title}</span>
                  </div>
                  <span>Chapter 1</span>
                </div>

                <div className="font-serif space-y-3">
                  <h3 className="text-lg font-bold leading-snug">
                    "Whitespace is rarely passive. In digital interface design, negative space performs structural work."
                  </h3>
                  <p className="text-xs leading-relaxed opacity-90 font-sans">
                    When we inspect high-craft typography, we notice rhythm is dictated by intentional intervals between components. Space creates clarity, and clarity engenders confidence in the reader.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-current/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono opacity-80">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      In-Browser Reader Active
                    </span>
                    <span>{readingProgress}% Read · Page 42 of {featuredBook.pages}</span>
                  </div>

                  <div className="w-full bg-current/10 h-2 rounded-full overflow-hidden relative">
                    <div
                      className="bg-amber-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${readingProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <button
                  onClick={() => onPreview(featuredBook)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  Try Live Reader Preview
                </button>
                <button
                  onClick={() => onAddToCart(featuredBook)}
                  className="px-5 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors"
                >
                  Buy ${featuredBook.price}
                </button>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 -z-10 w-56 h-56 bg-amber-200/50 rounded-full blur-3xl" />
          </div>

        </div>
      </div>
    </section>
  );
};
