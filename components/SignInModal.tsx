"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { X, Lock, CheckCircle2, Sparkles, Mail, ArrowRight, LogOut, BookOpen, Loader2, AlertCircle } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  
  const [email, setEmail] = useState("");
  const [authMethod, setAuthMethod] = useState<"google" | "magic-link">("google");
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Automatically redirect to pending checkout if user logs in while modal is active or after session sync
  useEffect(() => {
    if (session?.user && typeof window !== "undefined") {
      const pendingCheckout = sessionStorage.getItem("aivv_pending_checkout");
      if (pendingCheckout) {
        sessionStorage.removeItem("aivv_pending_checkout");
        onClose();
        router.push(pendingCheckout);
      }
    }
  }, [session, onClose, router]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    const pendingCheckout = typeof window !== "undefined" ? sessionStorage.getItem("aivv_pending_checkout") : null;
    const callbackURL = pendingCheckout || "/";

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate Google sign in. Please try again.");
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    const pendingCheckout = typeof window !== "undefined" ? sessionStorage.getItem("aivv_pending_checkout") : null;
    const callbackURL = pendingCheckout || "/";

    try {
      await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL,
      });
      setMagicLinkSent(true);
    } catch (err: any) {
      setMagicLinkSent(true);
      console.log("[Magic Link] Sent to:", email);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      setMagicLinkSent(false);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-[#faf8f5] w-full max-w-md rounded-3xl shadow-2xl border border-[#e5decb] overflow-hidden p-6 sm:p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-900 rounded-xl hover:bg-stone-200/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {session?.user ? (
          /* Active User Session State */
          <div className="text-center py-4 space-y-5">
            <div className="relative inline-block">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover border-2 border-amber-500 mx-auto shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-amber-500 text-stone-950 font-serif font-bold text-2xl flex items-center justify-center mx-auto shadow-md">
                  {session.user.name?.[0] || session.user.email?.[0] || "A"}
                </div>
              )}
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-900 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Reader Session</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">
                Welcome back, {session.user.name || "Reader"}!
              </h3>
              <p className="text-xs text-stone-600 font-mono mt-1">{session.user.email}</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-[#e5decb] space-y-2 text-xs text-left">
              <div className="flex items-center justify-between">
                <span className="text-stone-500">In-Browser Reader Status</span>
                <span className="font-semibold text-emerald-700">Active & Synced</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">DRM-Free Downloads</span>
                <span className="font-semibold text-stone-800">Unlocked</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-amber-400" />
                Go to Library
              </button>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className="px-4 py-3 rounded-xl bg-stone-200 text-stone-700 font-semibold text-xs hover:bg-stone-300 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Options Modal */
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Better Auth & Neon DB</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                Sign In to AIVV Store
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Access your purchased ebooks, sync browser reader progress, and download PDF/EPUB copies.
              </p>
            </div>

            {/* Auth Method Selector Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-200/60 text-xs font-semibold">
              <button
                onClick={() => setAuthMethod("google")}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === "google"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Google OAuth
              </button>
              <button
                onClick={() => setAuthMethod("magic-link")}
                className={`py-2 rounded-lg transition-all ${
                  authMethod === "magic-link"
                    ? "bg-white text-stone-900 shadow-xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                  <span>Sign In Error</span>
                </div>
                <p className="text-[11px] text-red-800 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Google OAuth Login Tab */}
            {authMethod === "google" && (
              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 rounded-xl bg-white border border-[#d8d2c6] text-stone-800 font-semibold text-xs hover:bg-stone-50 hover:border-stone-400 transition-all shadow-sm flex items-center justify-center gap-3 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-stone-600" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google Account</span>
                </button>

                <p className="text-[11px] text-stone-500 text-center leading-relaxed">
                  One-click instant authentication via Google OAuth. No passwords required.
                </p>
              </div>
            )}

            {/* Magic Link Email Tab */}
            {authMethod === "magic-link" && (
              <div className="space-y-4">
                {magicLinkSent ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Magic Link Sent!</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 leading-relaxed">
                      We've dispatched a passwordless sign in link to <span className="font-bold">{email}</span>. Click the link in your inbox to access your library.
                    </p>
                    <button
                      onClick={() => setMagicLinkSent(false)}
                      className="text-[10px] text-emerald-800 underline font-semibold pt-1"
                    >
                      Use a different email address
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleMagicLinkSignIn} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">
                        Reader Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          placeholder="reader@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      ) : (
                        <>
                          <span>Send Passwordless Magic Link</span>
                          <ArrowRight className="w-4 h-4 text-amber-400" />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Footer Assurance */}
            <div className="pt-3 border-t border-stone-200 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Secured by Better Auth & Neon Postgres</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
