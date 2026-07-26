"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store-context";
import {
  Plus,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Loader2,
  BookOpen,
  ShoppingBag,
  Users,
  Download,
} from "lucide-react";

interface AnalyticsData {
  totalReaders: number;
  grossRevenue: number;
  totalDelivered: number;
  totalDownloads: number;
  recentPurchases: Array<{
    title: string;
    user: string;
    amount: string;
    time: string;
    format: string;
  }>;
}

export default function AdminOverviewPage() {
  const { books } = useStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/analytics");
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error("Failed to fetch analytics:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalCatalogBooks = books.length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-100 text-emerald-900 border border-emerald-200 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time Live Analytics</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Sales & Store Performance
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Live metrics connected to database registered readers, DRM-free deliveries, and catalog products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition-colors"
            title="Refresh analytics data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-amber-700" : ""}`} />
          </button>

          <Link
            href="/admin/upload"
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center justify-center gap-1.5 shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Upload New Ebook
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Gross Revenue Card */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
          <span className="text-[11px] font-mono text-amber-900 uppercase font-semibold">
            Gross Revenue
          </span>
          <h3 className="font-serif text-3xl font-bold text-stone-900">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-700 my-1" />
            ) : (
              `$${(data?.grossRevenue || 0).toFixed(2)}`
            )}
          </h3>
          <p className="text-[10px] text-amber-800 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Live Store Sales
          </p>
        </div>

        {/* Ebooks Delivered Card */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
          <span className="text-[11px] font-mono text-stone-600 uppercase font-semibold">
            Licenses Delivered
          </span>
          <h3 className="font-serif text-3xl font-bold text-stone-900">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-stone-400 my-1" />
            ) : (
              data?.totalDelivered || 0
            )}
          </h3>
          <p className="text-[10px] text-stone-500 font-medium">Unlocked across readers</p>
        </div>

        {/* Registered Readers Card */}
        <div className="p-5 rounded-2xl bg-white border border-stone-200 space-y-1">
          <span className="text-[11px] font-mono text-stone-600 uppercase font-semibold">
            Registered Readers
          </span>
          <h3 className="font-serif text-3xl font-bold text-stone-900">
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-stone-400 my-1" />
            ) : (
              data?.totalReaders || 0
            )}
          </h3>
          <p className="text-[10px] text-stone-500 font-medium">Verified reader accounts</p>
        </div>

        {/* Catalog Ebooks Card */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
          <span className="text-[11px] font-mono text-emerald-900 uppercase font-semibold">
            Catalog Products
          </span>
          <h3 className="font-serif text-3xl font-bold text-emerald-900">
            {totalCatalogBooks}
          </h3>
          <p className="text-[10px] text-emerald-800 font-medium">Published ebook titles</p>
        </div>
      </div>

      {/* Transactions & Activity List */}
      <div className="bg-white rounded-3xl p-6 border border-[#e5decb] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Completed Purchases & Unlocks
            </h3>
            <p className="text-xs text-stone-500">
              Real-time reader acquisitions and license activations.
            </p>
          </div>
          <Link
            href="/admin/catalog"
            className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
          >
            Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center text-stone-500 text-xs font-mono">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600 mb-2" />
            <span>Fetching real-time purchase logs...</span>
          </div>
        ) : !data?.recentPurchases || data.recentPurchases.length === 0 ? (
          <div className="p-8 bg-stone-50 rounded-2xl border border-stone-200 text-center font-mono text-xs text-stone-500">
            No purchases logged yet. New customer orders will appear here in real time.
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentPurchases.map((tx, idx) => (
              <div
                key={idx}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs hover:bg-stone-100/80 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-stone-900 font-serif text-sm">{tx.title}</h4>
                  <p className="text-[11px] text-stone-500 font-mono mt-0.5">
                    {tx.user} · {tx.time}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg inline-block">
                    {tx.amount}
                  </span>
                  <span className="block text-[10px] text-stone-400 font-mono mt-1">
                    {tx.format}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
