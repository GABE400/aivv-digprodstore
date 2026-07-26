"use client";

import React from "react";
import { TESTIMONIALS } from "@/lib/data/books";
import { Star, Quote, ShieldCheck, Users, BookOpenCheck, Award } from "lucide-react";

export const SocialProofSection: React.FC = () => {
  const STATS = [
    { label: "Active Digital Readers", value: "50,000+", icon: Users },
    { label: "Ebooks Delivered Instantly", value: "120,000+", icon: BookOpenCheck },
    { label: "Average Reader Rating", value: "4.9 / 5.0", icon: Star },
    { label: "DRM-Free Guarantee", value: "100%", icon: ShieldCheck },
  ];

  return (
    <section className="py-16 md:py-24 bg-[#f6f2ec] border-b border-[#e8e2d9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Banner */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 md:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            {STATS.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-amber-400 mx-auto flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <p className="text-xs text-stone-400 font-medium">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-200">
            Reader Feedback
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Loved by Developers, Designers & Thinkers
          </h2>
          <p className="mt-2 text-stone-600 text-sm">
            Here is what verified readers have to say about the AIVV Store browser reading experience.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((test, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-[#e5decb] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-amber-700/20 mb-2" />
                <p className="text-sm text-stone-700 leading-relaxed font-sans italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.author}
                  className="w-10 h-10 rounded-full object-cover border border-stone-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900">{test.author}</h4>
                  <p className="text-[11px] text-stone-500">{test.title}</p>
                  <span className="text-[10px] text-amber-800 font-medium">
                    Purchased: {test.purchasedBook}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* As read by Logo Strip */}
        <div className="mt-16 pt-8 border-t border-[#e2dcd2] text-center">
          <p className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-6">
            READ BY ENGINEERS & DIRECTORS AT LEADING COMPANIES
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 opacity-60 grayscale hover:grayscale-0 transition-all text-stone-800 font-serif font-bold text-sm tracking-wider">
            <span>ATELIER DESIGN</span>
            <span>·</span>
            <span>SYSTEMS LAB</span>
            <span>·</span>
            <span>NEXUS SOFTWARE</span>
            <span>·</span>
            <span>CRAFT PULSE</span>
            <span>·</span>
            <span>HORIZON VENTURES</span>
          </div>
        </div>
      </div>
    </section>
  );
};
