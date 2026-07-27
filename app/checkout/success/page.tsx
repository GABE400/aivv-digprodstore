"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import {
  CheckCircle2,
  BookOpen,
  FileText,
  Download,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Loader2,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const { books } = useStore();
  const book = books.find((b) => b.id === bookId) || books[0];

  return (
    <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-12 space-y-8">
      
      {/* Celebration Header */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e5decb] shadow-sm text-center space-y-4 relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">
            ORDER #AIVV-{Math.floor(100000 + Math.random() * 900000)} CONFIRMED
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            Thank you! Your Ebook is Unlocked.
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
            You have permanent DRM-free access to <strong>"{book.title}"</strong>. Start reading in your browser now or download the files below.
          </p>
        </div>

        {/* Ebook Delivery Box */}
        <div className="max-w-md mx-auto p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left flex items-start gap-4 mt-6">
          <div className="w-16 h-24 rounded-xl bg-gradient-to-br from-stone-900 to-amber-950 p-2 flex flex-col justify-between text-stone-100 shrink-0 border border-stone-800 shadow-md">
            <span className="text-[8px] font-mono text-amber-400 font-bold uppercase truncate">
              {book.category}
            </span>
            <h4 className="font-serif text-[10px] font-bold line-clamp-2 leading-tight">
              {book.title}
            </h4>
            <span className="text-[7px] text-stone-400 truncate">By {book.author}</span>
          </div>

          <div className="space-y-1 flex-1">
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-[9px] font-bold">
              PERMANENT LICENSE
            </span>
            <h3 className="font-serif text-base font-bold text-stone-900 leading-snug">
              {book.title}
            </h3>
            <p className="text-xs text-stone-500 font-medium">By {book.author}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 max-w-md mx-auto space-y-3">
          <Link
            href="/library"
            className="w-full py-4 rounded-2xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Open in My Reader Library</span>
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`/api/download?bookId=${encodeURIComponent(book.id)}&format=pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-stone-600" />
              <span>Download PDF</span>
            </a>

            <a
              href={`/api/download?bookId=${encodeURIComponent(book.id)}&format=epub`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>Download EPUB</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      {/* Header Bar */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>
          <Link
            href="/library"
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
          >
            My Reader Library <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
