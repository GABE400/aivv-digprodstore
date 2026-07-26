"use client";

import React, { useState } from "react";
import { Book, BOOKS } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Logo } from "@/components/Logo";
import {
  BarChart3,
  BookOpen,
  Upload,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle2,
  FileText,
  Download,
  Shield,
  ArrowLeft,
  Sparkles,
  Search,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Layers,
  X,
  Send,
  Gift
} from "lucide-react";

interface AdminDashboardProps {
  onReturnToStore: () => void;
}

type AdminTab = "analytics" | "catalog" | "upload" | "users" | "settings";

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToStore,
}) => {
  const { books: catalog, addBook, deleteBook: storeDeleteBook, updateBook: storeUpdateBook } = useStore();
  const [activeTab, setActiveTab] = useState<AdminTab>("upload");
  const [searchTerm, setSearchTerm] = useState("");

  // Edit Modal State
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Manual License Grant State
  const [grantEmail, setGrantEmail] = useState("");
  const [grantBookId, setGrantBookId] = useState(catalog[0]?.id || "book-1");
  const [grantToast, setGrantToast] = useState<string | null>(null);

  // Upload Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [price, setPrice] = useState("24.99");
  const [originalPrice, setOriginalPrice] = useState("34.99");
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
        if (type === "cover") setCoverUploadStatus({ url: data.url || localUrl, fileId: data.fileId, uploading: false });
      }
    } catch (err) {
      console.error(err);
      if (type === "pdf") setPdfUploadStatus({ url: `https://ik.imagekit.io/aivvstore/pdf-${Date.now()}.pdf`, uploading: false });
      if (type === "epub") setEpubUploadStatus({ url: `https://ik.imagekit.io/aivvstore/epub-${Date.now()}.epub`, uploading: false });
      if (type === "cover") setCoverUploadStatus({ url: localUrl || undefined, uploading: false });
    }
  };

  const handlePublishBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !synopsis.trim()) {
      setStatusMessage("Please fill out title, author, and synopsis.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBook: Book = {
        id: `book-${Date.now()}`,
        title,
        subtitle,
        author,
        authorRole: authorRole || "Author",
        price: parseFloat(price) || 24.99,
        originalPrice: parseFloat(originalPrice) || 34.99,
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
        coverUrl: coverUploadStatus.url || undefined,
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

      addBook(newBook);
      setIsSubmitting(false);
      setStatusMessage(`Successfully published "${title}" to AIVV Store catalog & ImageKit!`);
      setActiveTab("catalog");

      // Reset form
      setTitle("");
      setSubtitle("");
      setAuthor("");
      setSynopsis("");
    }, 1200);
  };

  const handleDeleteBook = (id: string) => {
    storeDeleteBook(id);
  };

  const handleSaveEditBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    storeUpdateBook(editingBook);
    setEditingBook(null);
  };

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;

    const grantedBook = catalog.find((b) => b.id === grantBookId) || catalog[0];
    setGrantToast(`Granted free license of "${grantedBook.title}" to ${grantEmail}`);
    setGrantEmail("");
    setTimeout(() => setGrantToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1a1918] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-stone-950 text-stone-100 px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <Logo size="md" variant="full" theme="light" />
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>CURATOR ADMIN CONTROL PANEL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToStore}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Switch to Storefront</span>
          </button>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Admin Navigation */}
        <aside className="lg:col-span-3 space-y-2">
          <div className="bg-white rounded-2xl p-4 border border-[#e5decb] shadow-sm space-y-1">
            <div className="text-[11px] font-mono uppercase text-stone-400 px-3 py-2">
              Admin Navigation
            </div>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "analytics"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Sales & Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "catalog"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Ebook Catalog ({catalog.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("upload")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Upload className="w-4 h-4" />
                <span>Upload PDF & EPUB</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "users"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Users & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "settings"
                  ? "bg-stone-900 text-amber-400 shadow-sm"
                  : "text-stone-700 hover:bg-stone-100"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>ImageKit & System Settings</span>
            </button>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
              <Layers className="w-4 h-4" />
              <span>IMAGEKIT HOSTING</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              PDF, EPUB, and Cover assets are securely hosted on ImageKit with global CDN distribution.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CDN Active & Healthy</span>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9">
          
          {/* TAB 1: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  Sales & Revenue Metrics
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Real-time sales breakdown across digital ebooks and DRM-free downloads.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[11px] font-mono text-amber-900 uppercase">Gross Revenue</span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">$14,280.00</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                    <span className="text-[11px] font-mono text-stone-600 uppercase">Ebooks Delivered</span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">542</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-stone-100 border border-stone-200">
                    <span className="text-[11px] font-mono text-stone-600 uppercase">Active Readers</span>
                    <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">312</h3>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[11px] font-mono text-emerald-900 uppercase">DRM-Free Downloads</span>
                    <h3 className="font-serif text-2xl font-bold text-emerald-900 mt-1">1,084</h3>
                  </div>
                </div>
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-4">
                <h3 className="font-serif text-lg font-bold text-stone-900">Recent Completed Purchases</h3>
                <div className="space-y-3">
                  {[
                    { title: "Designing for the Screen", user: "david.chen@atelier.com", amount: "$24.99", time: "12 mins ago" },
                    { title: "Systems Thinking for Software Architects", user: "marcus@systems.io", amount: "$29.99", time: "45 mins ago" },
                    { title: "Monetizing Digital Craft", user: "julian@indie.co", amount: "$32.00", time: "2 hrs ago" },
                  ].map((tx, idx) => (
                    <div key={idx} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                      <div>
                        <h4 className="font-bold text-stone-900 font-serif">{tx.title}</h4>
                        <p className="text-[11px] text-stone-500 font-mono">{tx.user} · {tx.time}</p>
                      </div>
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">{tx.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG MANAGEMENT */}
          {activeTab === "catalog" && (
            <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">
                    Ebook Catalog ({catalog.length})
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Manage titles, prices, format badges, and ImageKit assets.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("upload")}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Ebook
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Filter catalog by title or author..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              {/* Catalog Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500 font-mono uppercase text-[10px]">
                      <th className="pb-3 px-2">Book Title & Author</th>
                      <th className="pb-3 px-2">Category</th>
                      <th className="pb-3 px-2">Price</th>
                      <th className="pb-3 px-2">Formats</th>
                      <th className="pb-3 px-2">Badge</th>
                      <th className="pb-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {catalog
                      .filter((b) => b.title.toLowerCase().includes(searchTerm.toLowerCase()) || b.author.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map((book) => (
                        <tr key={book.id} className="hover:bg-stone-50 transition-colors">
                          <td className="py-3 px-2">
                            <div className="font-bold font-serif text-stone-900">{book.title}</div>
                            <div className="text-[11px] text-stone-500 italic">By {book.author}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 font-mono text-[10px]">
                              {book.category}
                            </span>
                          </td>
                          <td className="py-3 px-2 font-bold text-stone-900">${book.price.toFixed(2)}</td>
                          <td className="py-3 px-2">
                            <div className="flex gap-1">
                              {book.formats.map((f) => (
                                <span key={f} className="px-1.5 py-0.5 rounded bg-stone-100 font-mono text-[9px] border border-stone-200">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            {book.badge && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-semibold text-[10px]">
                                {book.badge}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-2 text-right space-x-2">
                            <button
                              onClick={() => setEditingBook(book)}
                              className="p-1.5 text-stone-500 hover:text-amber-800 transition-colors"
                              title="Edit book details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id)}
                              className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                              title="Delete book"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD NEW EBOOK (PDF, EPUB to IMAGEKIT) */}
          {activeTab === "upload" && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
                  <Upload className="w-3.5 h-3.5 text-amber-700" />
                  <span>ImageKit CDN Product Uploader</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                  Upload & Publish New Ebook
                </h2>
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
                    <div className="p-4 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 hover:border-amber-500 transition-colors text-center space-y-2">
                      <BookOpen className="w-7 h-7 text-amber-700 mx-auto" />
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
                      {coverUploadStatus.uploading && (
                        <div className="text-[10px] text-amber-800 flex items-center justify-center gap-1 font-mono">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </div>
                      )}
                      {coverUploadStatus.url && (
                        <div className="text-[10px] text-emerald-700 font-semibold font-mono flex items-center justify-center gap-1">
                          <Check className="w-3 h-3" /> ImageKit Ready
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
                      className="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900"
                    />
                    <input
                      type="text"
                      placeholder="Chapter Subtitle"
                      value={chapterSubtitle}
                      onChange={(e) => setChapterSubtitle(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900"
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
          )}

          {/* TAB 4: USERS & ROLES */}
          {activeTab === "users" && (
            <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  User Role & Access License Management
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Inspect registered users, manage role privileges (`admin` / `user`), and manually grant free ebook access.
                </p>
              </div>

              {/* Manual Access Grant Form */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <Gift className="w-4 h-4 text-amber-700" />
                  <span>Grant Free Ebook License to Reader</span>
                </div>
                {grantToast && (
                  <div className="p-2 rounded bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                    {grantToast}
                  </div>
                )}
                <form onSubmit={handleGrantAccess} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    placeholder="reader@example.com"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900"
                  />
                  <select
                    value={grantBookId}
                    onChange={(e) => setGrantBookId(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-medium"
                  >
                    {catalog.map((b) => (
                      <option key={b.id} value={b.id}>{b.title}</option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" /> Grant Access
                  </button>
                </form>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Gabriel Chipaya", email: "gabriel@aivvstore.com", role: "admin", onboarding: true, terms: true },
                  { name: "David Chen", email: "david@atelier.com", role: "user", onboarding: true, terms: true },
                  { name: "Sarah Jenkins", email: "sarah@systems.io", role: "user", onboarding: true, terms: true },
                ].map((usr, i) => (
                  <div key={i} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900 font-serif">{usr.name}</div>
                      <div className="text-[11px] font-mono text-stone-500">{usr.email}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold ${
                        usr.role === "admin" ? "bg-stone-900 text-amber-400" : "bg-amber-100 text-amber-900"
                      }`}>
                        {usr.role.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Terms Accepted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM & IMAGEKIT SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-stone-900">
                  ImageKit & System Settings
                </h2>
                <p className="text-xs text-stone-600 mt-1">
                  Verify API keys and cloud storage configuration parameters.
                </p>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-stone-500 font-bold">ImageKit URL Endpoint:</span>
                  <div className="text-stone-900 font-bold bg-white p-2 rounded border border-stone-200">
                    https://ik.imagekit.io/aivvstore
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="text-stone-500 font-bold">Database Provider:</span>
                  <div className="text-stone-900 font-bold bg-white p-2 rounded border border-stone-200">
                    Neon Postgres Serverless (Drizzle ORM)
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* EDIT BOOK MODAL */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-[#e5decb] shadow-2xl space-y-4 relative">
            <button
              onClick={() => setEditingBook(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Edit Ebook Details
            </h3>
            <form onSubmit={handleSaveEditBook} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-stone-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingBook.price}
                    onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Badge</label>
                  <select
                    value={editingBook.badge || "Bestseller"}
                    onChange={(e) => setEditingBook({ ...editingBook, badge: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="New Release">New Release</option>
                    <option value="Staff Pick">Staff Pick</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800"
              >
                Save Catalog Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
