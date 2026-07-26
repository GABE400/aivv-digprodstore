"use client";

import React, { useState } from "react";
import { FAQS_COPY } from "@/lib/data/books";
import { ChevronDown, HelpCircle } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-[#faf8f5] border-b border-[#e8e2d9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-mono font-semibold text-amber-800 uppercase tracking-widest bg-amber-100/80 px-3.5 py-1 rounded-full border border-amber-200">
            Frequently Asked Questions
          </span>
          <h2 className="mt-4 font-serif text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            Clear answers for readers
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS_COPY.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#e5decb] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-stone-900 hover:text-amber-800 transition-colors focus:outline-none"
                >
                  <span className="font-serif text-lg font-bold flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-amber-100 text-amber-900" : "text-stone-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-sm text-stone-600 leading-relaxed border-t border-stone-100/80 font-sans">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
