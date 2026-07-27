"use client";

import React, { useState } from "react";
import { Book } from "@/lib/data/books";
import {
  X,
  Sun,
  Moon,
  BookOpen,
  Download,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Type,
  Check,
  Sparkles,
  FileText,
  Lock,
} from "lucide-react";

interface ReaderModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  mode?: "preview" | "full";
  isOwned?: boolean;
}

type ReaderTheme = "light" | "sepia" | "dark";

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  onClose,
  onAddToCart,
  mode = "preview",
  isOwned = false,
}) => {
  const [theme, setTheme] = useState<ReaderTheme>("sepia");
  const [fontSize, setFontSize] = useState<number>(18); // in px
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!book) return null;

  const canDownload = mode === "full" || isOwned;
  const currentChapter = book.sampleChapters[currentChapterIdx] || book.sampleChapters[0];

  const handleDownload = (format: "PDF" | "EPUB") => {
    if (!canDownload) {
      setDownloadToast(`Purchase required to unlock ${format} downloads!`);
      setTimeout(() => setDownloadToast(null), 3500);
      return;
    }

    setDownloadToast(`Preparing ${format} download for "${book.title}"...`);
    setTimeout(() => {
      const downloadUrl = `/api/download?bookId=${encodeURIComponent(book.id)}&format=${format.toLowerCase()}`;
      window.open(downloadUrl, "_blank");
      setDownloadToast(`Direct download started!`);
      setTimeout(() => setDownloadToast(null), 3000);
    }, 800);
  };

  // Theme styling classes
  const themeStyles = {
    light: "bg-[#ffffff] text-[#1f2937] border-stone-200",
    sepia: "bg-[#fbf7ee] text-[#2c2416] border-[#e8dfc8]",
    dark: "bg-[#141413] text-[#e5e5e0] border-stone-800",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-800">
        
        {/* Top Control Bar */}
        <div className="px-4 sm:px-6 py-3.5 bg-stone-900 text-stone-100 flex items-center justify-between gap-4 border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-bold text-white line-clamp-1">
                {book.title}
              </h3>
              <p className="text-[11px] text-stone-400">
                By {book.author} · {mode === "full" ? "Full Reader Edition" : "In-Browser Sample Preview"}
              </p>
            </div>
          </div>

          {/* Reader Customization Toolbar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Switches */}
            <div className="hidden sm:flex items-center bg-stone-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "light" ? "bg-white text-stone-900 shadow-xs" : "text-stone-400 hover:text-white"
                }`}
                title="Light Theme"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme("sepia")}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "sepia" ? "bg-[#fbf7ee] text-[#2c2416] font-bold shadow-xs" : "text-stone-400 hover:text-white"
                }`}
                title="Sepia Theme"
              >
                <span className="text-[11px] font-mono px-1">Sepia</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-lg transition-colors ${
                  theme === "dark" ? "bg-stone-950 text-stone-100 shadow-xs" : "text-stone-400 hover:text-white"
                }`}
                title="Dark Theme"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Font Size Adjusters */}
            <div className="flex items-center bg-stone-800 px-2 py-1 rounded-xl text-xs gap-1 text-stone-300">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="hover:text-white px-1 font-bold text-xs"
                title="Decrease Font Size"
              >
                A-
              </button>
              <span className="text-[10px] font-mono opacity-60 px-1">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(26, fontSize + 2))}
                className="hover:text-white px-1 font-bold text-sm"
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            {/* Bookmark Toggle */}
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked ? "bg-amber-500 text-stone-950" : "bg-stone-800 text-stone-300 hover:text-white"
              }`}
              title={isBookmarked ? "Bookmarked" : "Add Bookmark"}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Canvas Area */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-12 transition-colors ${themeStyles[theme]}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Chapter Header */}
            {currentChapter && (
              <div className="border-b border-current/10 pb-6 mb-8 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono opacity-70 uppercase tracking-wider">
                  <span>CHAPTER {currentChapterIdx + 1}</span>
                  <span>{book.readingTime} READ</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                  {currentChapter.title}
                </h2>
              </div>
            )}

            {/* Chapter Paragraphs */}
            {currentChapter && (
              <div
                className="font-serif leading-relaxed space-y-5 selection:bg-amber-500/30"
                style={{ fontSize: `${fontSize}px` }}
              >
                {currentChapter.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="indent-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {/* End of Section Banner */}
            {!canDownload ? (
              <div className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 font-sans">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-stone-950">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>End of Sample Preview</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Enjoyed reading "{book.title}"?
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  Unlock the remaining {book.pages} pages instantly in your browser tab, plus download DRM-free PDF and EPUB files to own permanently across all your devices.
                </p>

                <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      onAddToCart(book);
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold text-xs shadow-md hover:scale-105 transition-transform cursor-pointer"
                  >
                    Buy Full Ebook — ${book.price}
                  </button>

                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-200/70 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 text-xs font-semibold border border-stone-300 dark:border-stone-700">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>PDF & EPUB Downloads Locked</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-12 p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3 font-sans">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Licensed Reader Edition</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                  Thank you for reading "{book.title}"
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
                  You have permanent browser reading rights for this digital product. Download DRM-free versions below to read offline on any Kindle, Kobo, or mobile device.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => handleDownload("PDF")}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" /> Download PDF
                  </button>
                  <button
                    onClick={() => handleDownload("EPUB")}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all active:scale-95 shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" /> Download EPUB
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Download & Chapter Controls Footer */}
        <div className="px-6 py-3.5 bg-stone-900 text-stone-300 border-t border-stone-800 flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              disabled={currentChapterIdx === 0}
              onClick={() => setCurrentChapterIdx(currentChapterIdx - 1)}
              className="p-1.5 rounded-lg bg-stone-800 text-white disabled:opacity-30 disabled:hover:bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px]">
              Ch. {currentChapterIdx + 1} / {book.sampleChapters.length}
            </span>
            <button
              disabled={currentChapterIdx === book.sampleChapters.length - 1}
              onClick={() => setCurrentChapterIdx(currentChapterIdx + 1)}
              className="p-1.5 rounded-lg bg-stone-800 text-white disabled:opacity-30 disabled:hover:bg-stone-800 hover:bg-stone-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Download Notification Toast inside Modal */}
          {downloadToast && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 text-[11px] animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>{downloadToast}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            {canDownload ? (
              <>
                <button
                  onClick={() => handleDownload("PDF")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => handleDownload("EPUB")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>EPUB</span>
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/80 text-amber-400 text-xs font-medium border border-amber-500/20">
                <Lock className="w-3.5 h-3.5" />
                <span>Downloads Locked (Preview)</span>
              </div>
            )}
            <button
              onClick={() => {
                onAddToCart(book);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Buy — ${book.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
