"use client";

import React, { useState } from "react";
import { BOOKS } from "@/lib/data/books";
import { CheckCircle2, Gift, Send, Users, Shield } from "lucide-react";

export default function AdminUsersPage() {
  const [grantEmail, setGrantEmail] = useState("");
  const [grantBookId, setGrantBookId] = useState(BOOKS[0]?.id || "book-1");
  const [grantToast, setGrantToast] = useState<string | null>(null);

  const handleGrantAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;

    const grantedBook = BOOKS.find((b) => b.id === grantBookId) || BOOKS[0];
    setGrantToast(`Granted free license of "${grantedBook.title}" to ${grantEmail}`);
    setGrantEmail("");
    setTimeout(() => setGrantToast(null), 3500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          User Role & Access License Management
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Inspect registered users, manage role privileges (`admin` / `user`), and manually grant free ebook access.
        </p>
      </div>

      {/* Manual Access Grant Form */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
        <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
          <Gift className="w-4 h-4 text-amber-700" />
          <span>Grant Free Ebook License to Reader</span>
        </div>
        {grantToast && (
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold">
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
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-medium"
          />
          <select
            value={grantBookId}
            onChange={(e) => setGrantBookId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 font-medium"
          >
            {BOOKS.map((b) => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
          >
            <Send className="w-3.5 h-3.5 text-amber-400" /> Grant Access
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
