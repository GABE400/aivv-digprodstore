"use client";

import React from "react";
import { HOW_IT_WORKS_COPY } from "@/lib/data/books";
import { Search, ShoppingBag, BookOpen, ArrowRight, CheckCircle } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const ICONS = [Search, ShoppingBag, BookOpen];

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#f4efea] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-200">
            How It Works
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            From discovery to reading in seconds
          </h2>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {HOW_IT_WORKS_COPY.map((item, idx) => {
            const Icon = ICONS[idx] || Search;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-8 border border-[#e5decb] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-serif text-3xl font-bold text-amber-700/70 font-mono">
                      {item.step}
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-sm">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-stone-900">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm text-stone-600 leading-relaxed font-sans">
                    {item.sentence}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-medium text-stone-500">
                  <span className="inline-flex items-center gap-1.5 text-stone-700">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Instant Access
                  </span>
                  {idx < 2 && (
                    <ArrowRight className="w-4 h-4 text-stone-400 hidden md:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
