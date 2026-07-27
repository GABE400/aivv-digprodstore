"use client";

import React, { useState } from "react";
import { Logo } from "@/components/Logo";
import { FOOTER_NEWSLETTER_CTA } from "@/lib/data/books";
import { Send, CheckCircle2, Lock, Loader2, AlertCircle } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json();

      if (json.success) {
        setSubscribed(true);
        setEmail("");
      } else {
        setErrorMessage(json.error || "Failed to subscribe. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          
          {/* Brand & Newsletter Column */}
          <div className="md:col-span-6 space-y-4">
            <a href="#" className="inline-block">
              <Logo size="md" variant="full" theme="light" />
            </a>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed font-sans">
              An independent digital bookstore. Read ebooks instantly in your browser or download DRM-free PDF and EPUB files to keep permanently.
            </p>

            {/* Newsletter Box */}
            <div className="pt-4 space-y-2">
              <h4 className="text-xs font-mono font-semibold text-stone-200 uppercase tracking-wider">
                The Reader's Edition
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed max-w-md font-sans">
                {FOOTER_NEWSLETTER_CTA}
              </p>

              {errorMessage && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/80 border border-red-700/60 text-red-300 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {subscribed ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Welcome to The Reader's Edition! A confirmation email has been sent via Nodemailer.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md pt-1">
                  <input
                    type="email"
                    required
                    placeholder="reader@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2.5 rounded-xl bg-amber-500 text-stone-950 font-semibold text-xs hover:bg-amber-400 disabled:opacity-60 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Links Column 1 */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#browse" className="hover:text-amber-400 transition-colors">Browse Ebooks</a></li>
              <li><a href="#categories" className="hover:text-amber-400 transition-colors">Genres & Categories</a></li>
              <li><a href="#how-it-works" className="hover:text-amber-400 transition-colors">How It Works</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Digital Guarantee */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
              Reader Rights
            </h4>
            <div className="bg-stone-900 p-4 rounded-xl border border-stone-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Lock className="w-4 h-4" />
                <span>DRM-Free Ownership</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed font-sans">
                Every title includes permanent PDF and EPUB downloads with zero digital restrictions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom Strip */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} AIVV Store. Digital Ebook Marketplace.</p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400 font-mono">Accepted:</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono font-bold text-stone-300">VISA</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono font-bold text-stone-300">MASTERCARD</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono font-bold text-stone-300">APPLE PAY</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono font-bold text-stone-300">GOOGLE PAY</span>
            <span className="px-2.5 py-1 rounded bg-stone-900 border border-stone-800 text-[10px] font-mono font-bold text-stone-300">STRIPE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
