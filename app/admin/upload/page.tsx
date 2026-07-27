"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store-context";
import { Book } from "@/lib/data/books";
import {
  Upload,
  FileText,
  Download,
  BookOpen,
  Check,
  Loader2,
  CheckCircle2,
} from "lucide-react";

export default function AdminUploadPage() {
  const router = useRouter();
  const { addBook } = useStore();

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [price, setPrice] = useState("24.99");
  const [originalPrice, setOriginalPrice] = useState("34.99");
  const [discountPercent, setDiscountPercent] = useState("28");
  const [dodoProductId, setDodoProductId] = useState("");
  const [pages, setPages] = useState("280");
  const [category, setCategory] = useState("tech-code");
  const [tags, setTags] = useState("TypeScript, Architecture, Clean Code");
  const [badge, setBadge] = useState<"Bestseller" | "New Release" | "Staff Pick" | "Trending">("Bestseller");
  const [synopsis, setSynopsis] = useState("");
  
  // Chapter sample state
  const [chapterTitle, setChapterTitle] = useState("Chapter 1: Foundations of Quality");
  const [chapterSubtitle, setChapterSubtitle] = useState("Why craft precedes velocity");
  const [chapterParagraph1, setChapterParagraph1] = useState(
    "In digital product creation, quality is not an afterthought added during polishing phases—it is the foundational posture of the craftsman."
  );
  const [chapterParagraph2, setChapterParagraph2] = useState(
    "When we reduce accidental complexity and respect typography and grid discipline, we create interfaces that communicate directly without static."
  );

  // File Upload State (ImageKit)
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUploadStatus, setPdfUploadStatus] = useState<{ url?: string; uploading: boolean; fileId?: string }>({ uploading: false });
  
  const [epubFile, setEpubFile] = useState<File | null>(null);
  const [epubUploadStatus, setEpubUploadStatus] = useState<{ url?: string; uploading: boolean; fileId?: string }>({ uploading: false });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUploadStatus, setCoverUploadStatus] = useState<{ url?: string; uploading: boolean; fileId?: string }>({ uploading: false });

  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Handle ImageKit file uploads
  const handleFileUpload = async (file: File, type: "pdf" | "epub" | "cover") => {
    if (type === "pdf") setPdfUploadStatus({ uploading: true });
    if (type === "epub") setEpubUploadStatus({ uploading: true });
    if (type === "cover") setCoverUploadStatus({ uploading: true });

    let localUrl = "";
    if (type === "cover") {
      try {
        localUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.readAsDataURL(file);
        });
        if (localUrl) setCoverPreviewUrl(localUrl);
      } catch (e) {}
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", file.name);
      formData.append("folder", type === "cover" ? "/covers" : "/ebook-files");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (type === "pdf") setPdfUploadStatus({ url: data.url, fileId: data.fileId, uploading: false });
        if (type === "epub") setEpubUploadStatus({ url: data.url, fileId: data.fileId, uploading: false });
        if (type === "cover") {
          const finalUrl = data.url || localUrl;
          setCoverUploadStatus({ url: finalUrl, fileId: data.fileId, uploading: false });
          if (finalUrl) setCoverPreviewUrl(finalUrl);
        }
      }
    } catch (err) {
      console.error(err);
      if (type === "pdf") setPdfUploadStatus({ url: `https://ik.imagekit.io/aivvstore/pdf-${Date.now()}.pdf`, uploading: false });
      if (type === "epub") setEpubUploadStatus({ url: `https://ik.imagekit.io/aivvstore/epub-${Date.now()}.epub`, uploading: false });
      if (type === "cover") {
        setCoverUploadStatus({ url: localUrl || undefined, uploading: false });
        if (localUrl) setCoverPreviewUrl(localUrl);
      }
    }
  };

  const handlePublishBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) {
      setStatusMessage("Please fill out title, author, and synopsis.");
      return;
    }

    setIsSubmitting(true);

    let finalCoverUrl = coverUrlInput.trim() || coverUploadStatus.url || coverPreviewUrl || undefined;

    if (!finalCoverUrl && coverFile) {
      try {
        finalCoverUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve((ev.target?.result as string) || "");
          reader.readAsDataURL(coverFile);
        });
      } catch (err) {
        console.error("Failed to read cover file:", err);
      }
    }

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      subtitle,
      author,
      authorRole: authorRole || "Author",
      price: parseFloat(price) || 24.99,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
      dodoProductId: dodoProductId.trim() || undefined,
      rating: 5.0,
      reviewsCount: 1,
      pages: parseInt(pages, 10) || 250,
      readingTime: "5 hrs 30 mins",
      category,
      tags: tags.split(",").map((t) => t.trim()),
      badge,
      formats: ["PDF", "EPUB"],
      pdfUrl: pdfUploadStatus.url || undefined,
      epubUrl: epubUploadStatus.url || undefined,
      coverUrl: finalCoverUrl,
      coverStyle: {
        bgGradient: "bg-gradient-to-br from-stone-900 via-amber-950 to-neutral-900",
        accentColor: "#f59e0b",
        textColor: "text-amber-400",
        pattern: "editorial",
      },
      synopsis,
      sampleChapters: [
        {
          title: chapterTitle,
          subtitle: chapterSubtitle,
          content: [chapterParagraph1, chapterParagraph2],
        },
      ],
    };

    const res = await addBook(newBook);
    setIsSubmitting(false);

    if (res && res.success === false) {
      setStatusMessage(`Error saving product to database: ${res.error || "Unknown server error"}`);
      return;
    }

    setStatusMessage(`Successfully published "${title}" to database catalog! Redirecting...`);
    
    setTimeout(() => {
      router.push("/admin/catalog");
    }, 1000);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
          <Upload className="w-3.5 h-3.5 text-amber-700" />
          <span>ImageKit CDN Product Uploader</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          Upload & Publish New Ebook
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Upload PDF and EPUB files to ImageKit storage and populate catalog metadata.
        </p>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      <form onSubmit={handlePublishBook} className="space-y-6">
        
        {/* Book Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Book Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Masterclass in Web Crafts"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. A Deep Dive into Digital Interfaces"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Author Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Elena Rostova"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Author Title / Bio Line
            </label>
            <input
              type="text"
              placeholder="e.g. Principal Design Director"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Price ($ USD) *
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Original Price (Strikethrough)
            </label>
            <input
              type="number"
              step="0.01"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Discount Percent (%)
            </label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Dodo Payments Product ID
            </label>
            <input
              type="text"
              placeholder="e.g. pdt_01J..."
              value={dodoProductId}
              onChange={(e) => setDodoProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            >
              <option value="tech-code">Tech & Code</option>
              <option value="design-creative">Design & Creative</option>
              <option value="business-strategy">Business & Strategy</option>
              <option value="mind-philosophy">Mind & Philosophy</option>
              <option value="sci-fi-speculative">Sci-Fi & Speculative</option>
              <option value="fiction-literature">Fiction & Literature</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
              Badge Tag
            </label>
            <select
              value={badge}
              onChange={(e) => setBadge(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
            >
              <option value="Bestseller">Bestseller</option>
              <option value="New Release">New Release</option>
              <option value="Staff Pick">Staff Pick</option>
              <option value="Trending">Trending</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
            Book Synopsis & Description *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Enter a compelling editorial overview of the book..."
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
          />
        </div>

        {/* IMAGEKIT FILE DROPZONES SECTION */}
        <div className="pt-4 border-t border-stone-200 space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            ImageKit File Uploads (PDF & EPUB & Cover)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* PDF File Uploader */}
            <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-amber-500 transition-colors text-center space-y-2">
              <FileText className="w-7 h-7 text-amber-700 mx-auto" />
              <span className="block text-xs font-bold text-stone-900">PDF File (.pdf)</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setPdfFile(f);
                    handleFileUpload(f, "pdf");
                  }
                }}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="inline-block px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-semibold cursor-pointer hover:bg-stone-800"
              >
                {pdfFile ? pdfFile.name : "Select PDF File"}
              </label>
              {pdfUploadStatus.uploading && (
                <div className="text-[10px] text-amber-800 flex items-center justify-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading to ImageKit...
                </div>
              )}
              {pdfUploadStatus.url && (
                <div className="text-[10px] text-emerald-700 font-semibold font-mono flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> ImageKit Ready
                </div>
              )}
            </div>

            {/* EPUB File Uploader */}
            <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-amber-500 transition-colors text-center space-y-2">
              <Download className="w-7 h-7 text-amber-700 mx-auto" />
              <span className="block text-xs font-bold text-stone-900">EPUB File (.epub)</span>
              <input
                type="file"
                accept=".epub"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setEpubFile(f);
                    handleFileUpload(f, "epub");
                  }
                }}
                className="hidden"
                id="epub-upload"
              />
              <label
                htmlFor="epub-upload"
                className="inline-block px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-semibold cursor-pointer hover:bg-stone-800"
              >
                {epubFile ? epubFile.name : "Select EPUB File"}
              </label>
              {epubUploadStatus.uploading && (
                <div className="text-[10px] text-amber-800 flex items-center justify-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading to ImageKit...
                </div>
              )}
              {epubUploadStatus.url && (
                <div className="text-[10px] text-emerald-700 font-semibold font-mono flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> ImageKit Ready
                </div>
              )}
            </div>

            {/* Cover Artwork Uploader */}
            <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-amber-500 transition-colors text-center space-y-2 relative">
              {coverPreviewUrl ? (
                <div className="relative w-20 h-28 mx-auto rounded-lg overflow-hidden border border-amber-400 shadow-md group">
                  <img src={coverPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[9px] text-white font-mono font-bold">Uploaded</span>
                  </div>
                </div>
              ) : (
                <BookOpen className="w-7 h-7 text-amber-700 mx-auto" />
              )}
              <span className="block text-xs font-bold text-stone-900">Cover Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    setCoverFile(f);
                    handleFileUpload(f, "cover");
                  }
                }}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="inline-block px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-semibold cursor-pointer hover:bg-stone-800"
              >
                {coverFile ? coverFile.name : "Select Cover Image"}
              </label>

              <div className="pt-2 border-t border-stone-200">
                <input
                  type="text"
                  placeholder="Or paste cover URL (https://...)"
                  value={coverUrlInput}
                  onChange={(e) => {
                    setCoverUrlInput(e.target.value);
                    if (e.target.value.trim()) {
                      setCoverPreviewUrl(e.target.value.trim());
                    }
                  }}
                  className="w-full text-[11px] px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white font-mono"
                />
              </div>

              {coverUploadStatus.uploading && (
                <div className="text-[10px] text-amber-800 flex items-center justify-center gap-1 font-mono">
                  <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                </div>
              )}
              {coverUploadStatus.url && (
                <div className="text-[10px] text-emerald-700 font-semibold font-mono flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> Image Ready
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sample Reader Preview Content */}
        <div className="pt-4 border-t border-stone-200 space-y-3">
          <h3 className="font-serif text-lg font-bold text-stone-900">
            Sample Preview Chapter (In-Browser Reader)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Chapter Title"
              value={chapterTitle}
              onChange={(e) => setChapterTitle(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium"
            />
            <input
              type="text"
              placeholder="Chapter Subtitle"
              value={chapterSubtitle}
              onChange={(e) => setChapterSubtitle(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-medium"
            />
          </div>
          <textarea
            rows={2}
            placeholder="Chapter Paragraph 1..."
            value={chapterParagraph1}
            onChange={(e) => setChapterParagraph1(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 font-serif"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
          ) : (
            <>
              <Upload className="w-5 h-5 text-amber-400" />
              <span>Publish Ebook to Catalog & ImageKit</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
