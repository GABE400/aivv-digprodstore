"use client";

import React from "react";
import { VALUE_PROPS_COPY } from "@/lib/data/books";
import { Zap, Monitor, HardDriveDownload, CheckCircle2 } from "lucide-react";

export const ValuePropsSection: React.FC = () => {
  const ICONS = [Zap, Monitor, HardDriveDownload];

  return (
    <section className="py-16 md:py-24 bg-[#f6f2ec] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/70 px-3.5 py-1 rounded-full border border-amber-200">
            Why AIVV Store
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Built for modern readers who value speed and ownership
          </h2>
          <p className="mt-3 text-stone-600 text-base">
            No physical shipping delays, no app store friction, no DRM lock-in.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VALUE_PROPS_COPY.map((prop, index) => {
            const Icon = ICONS[index] || Zap;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border border-[#e5decb] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-800 flex items-center justify-center border border-amber-500/20">
                      <Icon className="w-6 h-6 text-amber-700" />
                    </div>
                    <span className="text-[11px] font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-md">
                      {prop.badge}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    {prop.title}
                  </h3>

                  <p className="mt-4 text-sm text-stone-600 leading-relaxed font-sans">
                    {prop.sentence}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-medium text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Included with every title</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
