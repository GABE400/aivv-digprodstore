"use client";

import React from "react";
import Link from "next/link";
import { Plus, ArrowRight, BarChart3, TrendingUp, Users, Download } from "lucide-react";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sales & Revenue Analytics
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Real-time digital bookstore performance, DRM-free downloads, and store metrics.
          </p>
        </div>

        <Link
          href="/admin/upload"
          className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" /> Upload New Ebook
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200">
          <span className="text-[11px] font-mono text-amber-900 uppercase font-semibold">Gross Revenue</span>
          <h3 className="font-serif text-3xl font-bold text-stone-900 mt-1.5">$14,280.00</h3>
          <p className="text-[10px] text-amber-800 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% this month
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200">
          <span className="text-[11px] font-mono text-stone-600 uppercase font-semibold">Ebooks Delivered</span>
          <h3 className="font-serif text-3xl font-bold text-stone-900 mt-1.5">542</h3>
          <p className="text-[10px] text-stone-500 font-medium mt-1">PDF & EPUB formats</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-stone-200">
          <span className="text-[11px] font-mono text-stone-600 uppercase font-semibold">Active Readers</span>
          <h3 className="font-serif text-3xl font-bold text-stone-900 mt-1.5">312</h3>
          <p className="text-[10px] text-stone-500 font-medium mt-1">Onboarding verified</p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <span className="text-[11px] font-mono text-emerald-900 uppercase font-semibold">Downloads</span>
          <h3 className="font-serif text-3xl font-bold text-emerald-900 mt-1.5">1,084</h3>
          <p className="text-[10px] text-emerald-800 font-medium mt-1">DRM-Free files served</p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-stone-900">Recent Completed Purchases</h3>
          <Link href="/admin/catalog" className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1">
            View Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-3">
          {[
            { title: "Designing for the Screen", user: "david.chen@atelier.com", amount: "$24.99", time: "12 mins ago", format: "PDF + EPUB" },
            { title: "Systems Thinking for Software Architects", user: "marcus@systems.io", amount: "$29.99", time: "45 mins ago", format: "PDF + EPUB" },
            { title: "Monetizing Digital Craft", user: "julian@indie.co", amount: "$32.00", time: "2 hrs ago", format: "PDF + EPUB" },
            { title: "The Typography of Mindful Interfaces", user: "elena@design.org", amount: "$19.50", time: "5 hrs ago", format: "PDF + EPUB" },
          ].map((tx, idx) => (
            <div key={idx} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs hover:bg-stone-100/80 transition-colors">
              <div>
                <h4 className="font-bold text-stone-900 font-serif text-sm">{tx.title}</h4>
                <p className="text-[11px] text-stone-500 font-mono mt-0.5">{tx.user} · {tx.time}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg inline-block">{tx.amount}</span>
                <span className="block text-[10px] text-stone-400 font-mono mt-1">{tx.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
