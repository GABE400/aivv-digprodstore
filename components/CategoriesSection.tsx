"use client";

import React from "react";
import { CATEGORIES } from "@/lib/data/books";
import { Code2, Palette, TrendingUp, BrainCircuit, Sparkles, BookOpen, ArrowUpRight } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Code2,
  Palette,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  BookOpen,
};

export const CategoriesSection: React.FC = () => {
  return (
    <section id="categories" className="py-16 md:py-24 bg-[#faf8f5] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-200">
              Browse by Genre
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              Explore Literary Categories
            </h2>
            <p className="mt-2 text-stone-600 text-sm max-w-xl">
              From deeply technical systems engineering manuals to rich design essays and speculative fiction.
            </p>
          </div>
        </div>

        {/* Category Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = ICON_MAP[cat.iconName] || BookOpen;
            return (
              <a
                key={cat.id}
                href="#browse"
                className="group relative bg-white rounded-2xl p-6 border border-[#e5decb] hover:border-amber-700/50 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Background ambient gradient flare */}
                <div
                  className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${cat.featuredColor} opacity-5 group-hover:opacity-15 transition-opacity blur-2xl -mr-8 -mt-8`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-xs font-mono font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                      {cat.count} Ebooks
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-stone-700 group-hover:text-stone-950">
                  <span>Explore category</span>
                  <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
