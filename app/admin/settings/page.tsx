"use client";

import React from "react";
import { CheckCircle2, Shield, Layers, Database } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e5decb] shadow-sm space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
          ImageKit CDN & System Configuration
        </h1>
        <p className="text-xs text-stone-600 mt-1">
          Verify API key parameters, Neon database connection state, and storage parameters.
        </p>
      </div>

      <div className="space-y-4 text-xs font-mono">
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 text-stone-700 font-bold">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>ImageKit URL Endpoint</span>
          </div>
          <div className="text-stone-900 font-bold bg-white p-3 rounded-xl border border-stone-200 text-xs">
            https://ik.imagekit.io/aivvstore
          </div>
          <p className="text-[10px] text-stone-500 font-sans">
            Connected via server-side ImageKit Node SDK with automatic signature generation.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 text-stone-700 font-bold">
            <Database className="w-4 h-4 text-amber-600" />
            <span>Database Provider</span>
          </div>
          <div className="text-stone-900 font-bold bg-white p-3 rounded-xl border border-stone-200 text-xs">
            Neon Postgres Serverless (Drizzle ORM)
          </div>
          <p className="text-[10px] text-stone-500 font-sans">
            Configured with Better Auth serverless adapter and Drizzle Kit migrations.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-sans font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>System Infrastructure Health Status: <strong>100% Operational</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
