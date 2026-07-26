"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Plus, Search, Edit, Trash2, X, Eye, RefreshCw } from "lucide-react";

export default function AdminCatalogPage() {
  const { books, deleteBook, updateBook, clearDemoBooks } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    updateBook(editingBook);
    setEditingBook(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Ebook Catalog Management ({books.length})
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage book titles, prices, format badges, and ImageKit CDN assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {books.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear demo sample books so catalog only displays your uploaded ebooks?")) {
                  clearDemoBooks();
                }
              }}
              className="px-3.5 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs hover:bg-red-50 hover:text-red-700 transition-colors border border-stone-200 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear Demo Books
            </button>
          )}

          <Link
            href="/admin/upload"
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Ebook
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter catalog by title, author, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
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
              <th className="pb-3 px-2">Badge Tag</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {books.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-stone-500 font-mono">
                  No ebooks in catalog. Upload your first PDF/EPUB ebook using the button above!
                </td>
              </tr>
            ) : (
              books
                .filter(
                  (b) =>
                    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    b.author.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((book) => (
                  <tr key={book.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3.5 px-2">
                      <div className="font-bold font-serif text-stone-900 text-sm">{book.title}</div>
                      <div className="text-[11px] text-stone-500 italic">By {book.author}</div>
                    </td>
                    <td className="py-3.5 px-2">
                      <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 font-mono text-[10px] border border-amber-200/60 font-semibold">
                        {book.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-bold text-stone-900 text-sm">
                      ${book.price.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex gap-1">
                        {book.formats.map((f) => (
                          <span
                            key={f}
                            className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[9px] border border-stone-200 font-bold"
                          >
                            {f}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-2">
                      {book.badge && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 font-semibold text-[10px]">
                          {book.badge}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-2 text-right space-x-2">
                      <button
                        onClick={() => setEditingBook(book)}
                        className="p-1.5 text-stone-500 hover:text-amber-800 transition-colors"
                        title="Edit book details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBook(book.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete book"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
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
              Edit Catalog Book
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-mono text-stone-600 mb-1">Title</label>
                <input
                  type="text"
                  value={editingBook.title}
                  onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingBook.price}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Badge Tag</label>
                  <select
                    value={editingBook.badge || "Bestseller"}
                    onChange={(e) =>
                      setEditingBook({ ...editingBook, badge: e.target.value as any })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="New Release">New Release</option>
                    <option value="Staff Pick">Staff Pick</option>
                    <option value="Trending">Trending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-mono text-stone-600 mb-1">Cover Image URL (https://... or upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/... or data:image/..."
                    value={editingBook.coverUrl || ""}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        coverUrl: e.target.value.trim() || undefined,
                      })
                    }
                    className="flex-1 p-2.5 rounded-xl border border-stone-300 font-mono text-[11px]"
                  />
                  <label className="px-3 py-2 bg-stone-900 text-white rounded-xl text-[11px] font-bold cursor-pointer hover:bg-stone-800 shrink-0 flex items-center">
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const res = ev.target?.result as string;
                            if (res) {
                              setEditingBook({ ...editingBook, coverUrl: res });
                            }
                          };
                          reader.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={editingBook.discountPercent || ""}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        discountPercent: parseFloat(e.target.value) || undefined,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-mono text-stone-600 mb-1">Dodo Product ID</label>
                  <input
                    type="text"
                    value={editingBook.dodoProductId || ""}
                    onChange={(e) =>
                      setEditingBook({
                        ...editingBook,
                        dodoProductId: e.target.value.trim() || undefined,
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition-colors shadow-sm"
              >
                Save Changes to Catalog
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
