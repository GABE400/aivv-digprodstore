"use client";

import React, { useState } from "react";
import { X, Check, ShieldCheck, BookOpen, Sparkles, UserCheck, Shield, FileText, ArrowRight, ArrowLeft } from "lucide-react";

export interface OnboardingData {
  displayName: string;
  role: "user";
  preferredFormat: "Browser" | "EPUB" | "PDF";
  favoriteGenres: string[];
  acceptedTerms: boolean;
}

interface OnboardingModalProps {
  isOpen: boolean;
  userEmail: string;
  initialName?: string;
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userEmail,
  initialName = "",
  onComplete,
}) => {
  const [step, setStep] = useState<number>(1);
  const [displayName, setDisplayName] = useState<string>(initialName || userEmail.split("@")[0]);
  const role = "user" as const; // Only admins can assign admin role via /admin/users
  const [preferredFormat, setPreferredFormat] = useState<"Browser" | "EPUB" | "PDF">("Browser");
  const [favoriteGenres, setFavoriteGenres] = useState<string[]>(["Tech & Code", "Design & Creative"]);
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const GENRES_LIST = [
    "Tech & Code",
    "Design & Creative",
    "Business & Strategy",
    "Mind & Philosophy",
    "Sci-Fi & Speculative",
    "Fiction & Literature",
  ];

  const toggleGenre = (genre: string) => {
    if (favoriteGenres.includes(genre)) {
      setFavoriteGenres(favoriteGenres.filter((g) => g !== genre));
    } else {
      setFavoriteGenres([...favoriteGenres, genre]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !displayName.trim()) {
      setErrorMsg("Please enter your display name.");
      return;
    }
    setErrorMsg(null);
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setErrorMsg("You must accept the Terms of Service & Digital License Agreement to proceed.");
      return;
    }
    setErrorMsg(null);
    onComplete({
      displayName,
      role,
      preferredFormat,
      favoriteGenres,
      acceptedTerms,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#faf8f5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#e5decb] overflow-hidden p-6 sm:p-8 relative">
        {/* Step Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-stone-500 mb-2">
            <span>STEP {step} OF 3</span>
            <span className="text-amber-800">
              {step === 1 && "Your Profile"}
              {step === 2 && "Reading Preferences"}
              {step === 3 && "Terms & Agreement"}
            </span>
          </div>
          <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {errorMsg}
          </div>
        )}

        {/* STEP 1: Profile Details & Role */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>First-Time Reader Onboarding</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Welcome to AIVV Store
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Let's set up your reader profile before entering your library.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-amber-600 font-medium"
              />
            </div>

            {/* Account role info — admin role is assigned only by existing admins */}
            <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-stone-900">Reader Account</h4>
                <p className="text-[10px] text-stone-500 mt-0.5 leading-tight">
                  You'll have full access to buy, read in-browser, and download DRM-free EPUB/PDF files. Admin access can only be granted by an existing store administrator.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="w-full py-3 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>Continue to Preferences</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        )}

        {/* STEP 2: Reading Preferences */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Reading Preferences
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Customize your default reading experience and genre recommendations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-2">
                Preferred Default Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Browser", "EPUB", "PDF"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setPreferredFormat(fmt)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      preferredFormat === fmt
                        ? "bg-stone-900 text-amber-400 border-stone-900 shadow-sm"
                        : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    {fmt === "Browser" ? "Tab Reader" : fmt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-stone-700 font-semibold mb-2">
                Favorite Ebook Genres
              </label>
              <div className="flex flex-wrap gap-2">
                {GENRES_LIST.map((genre) => {
                  const selected = favoriteGenres.includes(genre);
                  return (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => toggleGenre(genre)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        selected
                          ? "bg-amber-100 text-amber-900 border-amber-300 font-semibold"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 text-amber-800" />}
                      <span>{genre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Continue to Agreement</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Terms & Conditions Agreement */}
        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1 text-amber-800 font-semibold text-xs mb-1">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Legal & License Agreement</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Terms & Conditions
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Please review and accept our reader license agreement to complete your account setup.
              </p>
            </div>

            {/* Terms Summary Scroll Box */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 max-h-36 overflow-y-auto text-[11px] text-stone-600 space-y-2 leading-relaxed font-sans">
              <p className="font-bold text-stone-900">AIVV Store Digital Content License</p>
              <p>
                1. <strong>Personal Non-Commercial Use:</strong> Purchases grant you permanent, personal, DRM-free reading rights for in-browser access and PDF/EPUB downloads across your personal devices.
              </p>
              <p>
                2. <strong>No Redistribution:</strong> You agree not to publicly redistribute, resell, or upload purchased ebook files to public file-sharing networks.
              </p>
              <p>
                3. <strong>Refund Policy:</strong> 14-day money-back guarantee if a digital file is unreadable or fails technical specifications.
              </p>
              <p>
                4. <strong>Privacy:</strong> We collect minimal data necessary for reading progress synchronization and order history.
              </p>
            </div>

            {/* Mandatory Checkbox */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-amber-600 rounded border-stone-300"
              />
              <span className="text-xs text-stone-800 font-medium leading-tight">
                I accept the <strong>AIVV Store Terms of Service</strong> and <strong>Digital Content License Agreement</strong>.
              </span>
            </label>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-300 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                Complete Onboarding & Enter Store
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
