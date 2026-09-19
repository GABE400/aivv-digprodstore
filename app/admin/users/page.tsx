"use client";

import React, { useState } from "react";
import { useStore } from "@/lib/store-context";
import { BOOKS } from "@/lib/data/books";
import { CheckCircle2, Gift, Send, Loader2, AlertCircle } from "lucide-react";

export default function AdminUsersPage() {
  const { books } = useStore();
  const catalog = books.length > 0 ? books : BOOKS;

  const [grantEmail, setGrantEmail] = useState("");
  const [grantBookId, setGrantBookId] = useState(catalog[0]?.id || "book-1");
  const [grantToast, setGrantToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGrantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;

    setIsSubmitting(true);
    setGrantToast(null);

    try {
      const res = await fetch("/api/admin/grant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: grantEmail.trim(),
          bookId: grantBookId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGrantToast({
          type: "error",
          message: data.error || "Failed to grant access",
        });
      } else {
        const grantedBook = catalog.find((b) => b.id === grantBookId) || catalog[0];
        setGrantToast({
          type: "success",
          message: `Granted free license of "${grantedBook.title}" to ${grantEmail}`,
        });
        setGrantEmail("");
      }
    } catch (err: unknown) {
      setGrantToast({
        type: "error",
        message: err instanceof Error ? err.message : "Network error granting license",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setGrantToast(null), 5000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          User Role & Access License Management
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Inspect registered users, manage role privileges (<code>admin</code> / <code>user</code>), and manually grant free ebook access.
        </p>
      </div>

      {/* Manual Access Grant Form */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
          <Gift className="w-4 h-4 text-amber-700" />
          <span>Grant Free Ebook License to Reader</span>
        </div>
        {grantToast && (
          <div
            className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              grantToast.type === "success"
                ? "bg-emerald-100 text-emerald-900"
                : "bg-red-100 text-red-900"
            }`}
          >
            {grantToast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{grantToast.message}</span>
          </div>
        )}
        <form onSubmit={handleGrantAccess} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="reader@example.com"
            value={grantEmail}
            onChange={(e) => setGrantEmail(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-medium"
          />
          <select
            value={grantBookId}
            onChange={(e) => setGrantBookId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-medium"
          >
            {catalog.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{isSubmitting ? "Granting..." : "Grant Access"}</span>
          </button>
        </form>
      </div>

      {/* Registered Users Table */}
      <div className="space-y-3">
        {[
          { name: "Gabriel Chipaya", email: "gabriel@aivvstore.com", role: "admin", onboarding: true, terms: true },
          { name: "David Chen", email: "david@atelier.com", role: "user", onboarding: true, terms: true },
          { name: "Sarah Jenkins", email: "sarah@systems.io", role: "user", onboarding: true, terms: true },
          { name: "Julian Thorne", email: "julian@indie.co", role: "user", onboarding: true, terms: true },
        ].map((usr, i) => (
          <div
            key={i}
            className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs hover:bg-stone-100/80 transition-colors"
          >
            <div>
              <div className="font-bold text-stone-900 font-serif text-sm">{usr.name}</div>
              <div className="text-[11px] font-mono text-stone-500 mt-0.5">{usr.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold ${
                  usr.role === "admin"
                    ? "bg-stone-900 text-amber-400 border border-stone-700"
                    : "bg-amber-100 text-amber-900 border border-amber-200"
                }`}
              >
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
  );
}
