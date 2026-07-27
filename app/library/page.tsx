"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import { ReaderModal } from "@/components/ReaderModal";
import { authClient } from "@/lib/auth-client";
import {
  BookOpen,
  Download,
  FileText,
  User,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  LogOut,
  Search,
  Loader2,
  Lock,
} from "lucide-react";

export default function UserLibraryPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const { books } = useStore();
  const ownedBooksString = (session?.user as any)?.ownedBooks || "";
  const ownedIds = ownedBooksString ? ownedBooksString.split(",") : [];
  const purchasedBooks = books.filter((b) => ownedIds.includes(b.id));

  const [activeReadingBook, setActiveReadingBook] = useState<Book | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/?auth_error=signin_required");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-8 text-stone-700">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
        <span className="text-xs font-mono font-semibold">Loading Reader Library...</span>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-8 text-stone-900 space-y-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
          <Lock className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="font-serif text-2xl font-bold">Authentication Required</h2>
        <p className="text-xs text-stone-600 font-mono">Please sign in to access your personal reader library.</p>
        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const userEmail = session.user.email || "reader@example.com";
  const userName = session.user.name || "Avid Reader";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans">
      <title>My Reader Library | AIVV Store</title>
      <meta name="description" content="Access your purchased DRM-free ebooks and start reading." />
      
      {/* Header Bar */}
      <header className="bg-white border-b border-[#e8e2d9] py-4 px-4 sm:px-8 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo size="md" variant="full" theme="dark" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/books"
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 transition-colors hidden sm:block"
            >
              Browse Store Catalog
            </Link>

            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-800 text-xs font-semibold hover:bg-stone-200 transition-colors border border-stone-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
        
        {/* User Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden">
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Reader Library</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold">
              Welcome back, {userName}
            </h1>
            <p className="text-xs text-stone-400 font-mono">
              {userEmail} · Preferred Format: <span className="text-amber-400 font-bold">In-Browser + EPUB</span>
            </p>
          </div>

          <div className="flex items-center gap-3 z-10">
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 text-center">
              <span className="block text-[10px] font-mono text-stone-400 uppercase">Owned Ebooks</span>
              <span className="font-serif text-2xl font-bold text-amber-400">{purchasedBooks.length}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 text-center">
              <span className="block text-[10px] font-mono text-stone-400 uppercase">Read Time</span>
              <span className="font-serif text-2xl font-bold text-stone-100">8.5 hrs</span>
            </div>
          </div>
        </div>

        {/* Library Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              My Purchased Ebooks ({purchasedBooks.length})
            </h2>
            <p className="text-xs text-stone-600 mt-0.5">
              Read instantly in your browser or download DRM-free PDF and EPUB files anytime.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search your library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
            />
          </div>
        </div>

        {/* Ebooks Grid */}
        {purchasedBooks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-[#e5decb] text-center space-y-4 max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="font-serif text-xl font-bold text-stone-900">Your Library is Empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              You haven't purchased or unlocked any ebooks yet. Head over to our catalog to buy your first premium digital book.
            </p>
            <Link
              href="/books"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
            >
              Browse Ebook Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {purchasedBooks
              .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((book) => (
                <div
                  key={book.id}
                  className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Book Header Visual */}
                    <div className="flex items-start gap-4">
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="w-20 h-28 rounded-xl object-cover shadow-md shrink-0 border border-stone-200"
                        />
                      ) : (
                        <div className="w-20 h-28 rounded-xl bg-gradient-to-br from-stone-900 to-amber-950 p-2.5 flex flex-col justify-between shadow-md shrink-0 border border-stone-800">
                          <span className="text-[9px] font-mono text-amber-400 uppercase font-bold truncate">
                            {book.category}
                          </span>
                          <h4 className="font-serif text-xs font-bold text-stone-100 line-clamp-2 leading-tight">
                            {book.title}
                          </h4>
                          <span className="text-[8px] text-stone-400 italic truncate">By {book.author}</span>
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-mono text-[10px] font-bold">
                          PURCHASED & UNLOCKED
                        </span>
                        <h3 className="font-serif text-lg font-bold text-stone-900 leading-snug">
                          {book.title}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium">By {book.author}</p>
                        <p className="text-[11px] text-stone-400 font-mono pt-1">
                          {book.pages} pages · {book.readingTime}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {book.synopsis}
                    </p>
                  </div>

                  {/* Reader Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-stone-100">
                    <button
                      onClick={() => setActiveReadingBook(book)}
                      className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Read in Browser</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`/api/download?bookId=${encodeURIComponent(book.id)}&format=pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors text-center cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-stone-600" />
                        <span>Download PDF</span>
                      </a>

                      <a
                        href={`/api/download?bookId=${encodeURIComponent(book.id)}&format=epub`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-stone-200 transition-colors text-center cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-stone-600" />
                        <span>Download EPUB</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* Reader Modal */}
      <ReaderModal
        book={activeReadingBook}
        onClose={() => setActiveReadingBook(null)}
        onAddToCart={() => {}}
        mode="full"
        isOwned={true}
      />
    </div>
  );
}
