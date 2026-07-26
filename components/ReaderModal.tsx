"use client";

import React, { useState } from "react";
import { Book } from "@/lib/data/books";
import { X, Sun, Moon, BookOpen, Download, Bookmark, ChevronLeft, ChevronRight, Type, Check, Sparkles, FileText } from "lucide-react";

interface ReaderModalProps {
  book: Book | null;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  mode?: "preview" | "full";
}

type ReaderTheme = "light" | "sepia" | "dark";

export const ReaderModal: React.FC<ReaderModalProps> = ({
  book,
  onClose,
  onAddToCart,
  mode = "preview",
}) => {
  const [theme, setTheme] = useState<ReaderTheme>("sepia");
  const [fontSize, setFontSize] = useState<number>(18); // in px
  const [currentChapterIdx, setCurrentChapterIdx] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  if (!book) return null;

  const currentChapter = book.sampleChapters[currentChapterIdx] || book.sampleChapters[0];

  const handleDownload = (format: "PDF" | "EPUB") => {
    const fileUrl = format === "PDF" ? book.pdfUrl : book.epubUrl;
    setDownloadToast(`Preparing ${format} download for "${book.title}"...`);
    setTimeout(() => {
      if (fileUrl) {
        const link = document.createElement("a");
        link.href = fileUrl;
        link.download = `${book.title}.${format.toLowerCase()}`;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadToast(`Direct download started!`);
      } else {
        setDownloadToast(`Mock ${format} file downloaded successfully!`);
      }
      setTimeout(() => setDownloadToast(null), 3000);
    }, 1000);
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
              <p className="text-[11px] text-stone-400">By {book.author} · In-Browser Reader</p>
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
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Reader Canvas Area */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-12 transition-colors ${themeStyles[theme]}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Header info */}
            <div className="border-b pb-4 mb-6 border-current/10 flex items-center justify-between">
              <span className="text-xs font-mono tracking-widest uppercase opacity-70">
                {mode === "full" ? "PREMIUM EDITION" : "SAMPLE PREVIEW"} · CHAPTER {currentChapterIdx + 1} OF {book.sampleChapters.length}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300">
                  DRM-Free Edition
                </span>
              </div>
            </div>

            {/* Chapter Header */}
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
                {currentChapter.title}
              </h2>
              {currentChapter.subtitle && (
                <p className="mt-2 text-sm italic opacity-80 font-serif">
                  {currentChapter.subtitle}
                </p>
              )}
            </div>

            {/* Chapter Content Body */}
            <div
              className="space-y-5 font-serif leading-relaxed"
              style={{ fontSize: `${fontSize}px` }}
            >
              {currentChapter.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="indent-4">
                  {paragraph}
                </p>
              ))}
            </div>

             {/* End of Preview Banner */}
             {mode !== "full" ? (
               <div className="mt-12 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-3 font-sans">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500 text-stone-950">
                   <Sparkles className="w-3.5 h-3.5" />
                   <span>You've reached the end of the preview</span>
                 </div>
                 <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                   Enjoyed reading "{book.title}"?
                 </h4>
                 <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                   Unlock the remaining {book.pages} pages instantly in your browser tab, plus download DRM-free PDF and EPUB files for your Kindle/Kobo.
                 </p>

                 <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                   <button
                     onClick={() => {
                       onAddToCart(book);
                       onClose();
                     }}
                     className="px-6 py-2.5 rounded-xl bg-stone-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold text-xs shadow-md hover:scale-105 transition-transform"
                   >
                     Buy Full Ebook — ${book.price}
                   </button>
                   <div className="flex items-center gap-2">
                     <button
                       onClick={() => handleDownload("PDF")}
                       className="flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors"
                     >
                       <Download className="w-3.5 h-3.5" /> PDF
                     </button>
                     <button
                       onClick={() => handleDownload("EPUB")}
                       className="flex items-center gap-1 px-3 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 text-xs font-medium hover:bg-stone-300 transition-colors"
                     >
                       <Download className="w-3.5 h-3.5" /> EPUB
                     </button>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="mt-12 p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-3 font-sans">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700">
                   <Check className="w-3.5 h-3.5 animate-pulse" />
                   <span>Licensed Premium Edition</span>
                 </div>
                 <h4 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                   Thank you for reading "{book.title}"
                 </h4>
                 <p className="text-xs text-stone-600 dark:text-stone-350 max-w-md mx-auto leading-relaxed">
                   You have permanent browser reading rights for this digital product. You can also download DRM-free versions to read offline on any Kindle, Kobo, or mobile device.
                 </p>
                 <div className="flex justify-center gap-3 pt-2">
                   <button
                     onClick={() => handleDownload("PDF")}
                     className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all active:scale-95 shadow-sm"
                   >
                     <FileText className="w-3.5 h-3.5 text-stone-400" /> Download PDF
                   </button>
                   <button
                     onClick={() => handleDownload("EPUB")}
                     className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-all active:scale-95 shadow-sm"
                   >
                     <Download className="w-3.5 h-3.5 text-stone-400" /> Download EPUB
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
            <button
              onClick={() => handleDownload("EPUB")}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download EPUB</span>
            </button>
            <button
              onClick={() => {
                onAddToCart(book);
                onClose();
              }}
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              Buy — ${book.price}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
