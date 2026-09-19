"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Book } from "@/lib/data/books";
import { useStore } from "@/lib/store-context";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ValuePropsSection } from "@/components/ValuePropsSection";
import { FeaturedBooksSection } from "@/components/FeaturedBooksSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { CategoriesSection } from "@/components/CategoriesSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { ReaderModal } from "@/components/ReaderModal";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { SignInModal } from "@/components/SignInModal";
import { OnboardingModal, OnboardingData } from "@/components/OnboardingModal";
import { authClient } from "@/lib/auth-client";
import { Check, Shield, ArrowRight } from "lucide-react";

function StoreContent() {
  const {
    books,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    isCartOpen,
    setIsCartOpen,
  } = useStore();
  const { data: session } = authClient.useSession();
  const searchParams = useSearchParams();
  
  const [previewBook, setPreviewBook] = useState<Book | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const featuredBook = books[0] || null;
  const userRole = ((session?.user as { role?: string })?.role || "user") as "user" | "admin";
  const isAuthenticated = Boolean(session?.user);
  const isAdmin = isAuthenticated && userRole === "admin";

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  // Check URL auth errors (e.g. redirected from /admin or /library)
  useEffect(() => {
    const authError = searchParams.get("auth_error");
    if (authError === "admin_required") {
      const timer = setTimeout(() => {
        showToast("Access Denied: Admin role required for /admin routes.");
        setSignInModalOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    } else if (authError === "signin_required") {
      const timer = setTimeout(() => {
        showToast("Please sign in to access your personal reader library.");
        setSignInModalOpen(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [searchParams, showToast]);

  // Automatically trigger onboarding if user is logged in for the first time
  useEffect(() => {
    if (session?.user) {
      const userObj = session.user as { id?: string; email?: string; onboardingCompleted?: boolean };
      const localKey = `aivv_onboarded_${userObj.id || userObj.email}`;
      const alreadyDone = typeof window !== "undefined" && localStorage.getItem(localKey) === "true";
      const isCompleted = userObj.onboardingCompleted;
      if (!alreadyDone && (isCompleted === false || isCompleted === undefined)) {
        const timer = setTimeout(() => {
          setOnboardingOpen(true);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [session]);

  const handleAddToCart = (book: Book) => {
    addToCart(book);
    showToast(`Added "${book.title}" to cart`);
  };

  const handleOnboardingComplete = async (data: OnboardingData) => {
    setOnboardingOpen(false);

    // Persist to localStorage immediately so it never pops up again
    const userObj = session?.user as { id?: string; email?: string } | undefined;
    const localKey = `aivv_onboarded_${userObj?.id || userObj?.email}`;
    localStorage.setItem(localKey, "true");

    // Persist to database via API
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: data.displayName,
          preferredFormat: data.preferredFormat,
          favoriteGenres: data.favoriteGenres,
        }),
      });
    } catch (err) {
      console.warn("[Onboarding] Failed to persist to DB, saved locally.", err);
    }

    showToast(`Welcome ${data.displayName}! Onboarding complete. Terms accepted.`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1a1918] flex flex-col font-sans relative selection:bg-[#f3ead8] selection:text-[#1a1918]">
      
      {/* Admin Quick Action Banner (Shown ONLY to verified Admin role users) */}
      {isAdmin && (
        <div className="bg-stone-950 text-stone-100 px-4 py-2.5 border-b border-amber-500/30 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-mono text-amber-300 font-bold">ADMIN CURATOR PANEL</span>
              <span className="hidden sm:inline text-stone-400">· Manage ImageKit Ebook Uploads & Store Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-3 py-1 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs hover:bg-amber-400 transition-colors flex items-center gap-1 shadow-sm"
              >
                <span>Open /admin Control Panel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 1. Sticky Nav */}
      <Navbar
        cartCount={cart.length}
        userRole={userRole}
        onToggleRole={() => {
          if (!isAuthenticated) {
            showToast("Please sign in to access user role privileges.");
            setSignInModalOpen(true);
            return;
          }
          if (!isAdmin) {
            showToast("Role switching requires verified Admin permissions.");
            return;
          }
        }}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenSignIn={() => setSignInModalOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          featuredBook={featuredBook}
          onPreview={(book) => setPreviewBook(book)}
          onAddToCart={handleAddToCart}
        />

        {/* 3. Value Props Section */}
        <ValuePropsSection />

        {/* 4. Featured/Bestselling Books Section */}
        <FeaturedBooksSection
          onPreview={(book) => setPreviewBook(book)}
          onAddToCart={handleAddToCart}
          cartBookIds={cart.map((b) => b.id)}
        />

        {/* 5. How It Works Section */}
        <HowItWorksSection />

        {/* 6. Categories Section */}
        <CategoriesSection />

        {/* 7. Trust / Social Proof Section */}
        {/* <SocialProofSection /> */}

        {/* 8. FAQ Section */}
        <FaqSection />
      </main>

      {/* 9. Footer Section */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <ReaderModal
        book={previewBook}
        onClose={() => setPreviewBook(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartBooks={cart}
        onRemoveFromCart={removeFromCart}
        onOpenReader={(book) => {
          setPreviewBook(book);
        }}
        onClearCart={clearCart}
        onOpenSignIn={() => setSignInModalOpen(true)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onPreview={(book) => setPreviewBook(book)}
        onAddToCart={handleAddToCart}
      />

      <SignInModal
        isOpen={signInModalOpen}
        onClose={() => setSignInModalOpen(false)}
      />

      {/* First-Time User Onboarding & Terms Acceptance Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        userEmail={session?.user?.email || "reader@example.com"}
        initialName={session?.user?.name || ""}
        onComplete={handleOnboardingComplete}
      />

      {/* Global Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-3 text-xs font-semibold animate-bounce">
          <div className="w-6 h-6 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <StoreContent />
    </Suspense>
  );
}
