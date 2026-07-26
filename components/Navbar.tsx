"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { BookOpen, ShoppingBag, Search, Menu, X, User, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface NavbarProps {
  cartCount: number;
  userRole: "user" | "admin";
  onToggleRole: () => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  userRole,
  onToggleRole,
  onOpenCart,
  onOpenSearch,
  onOpenSignIn,
}) => {
  const { data: session } = authClient.useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authenticated user role check
  const actualRole = (session?.user as any)?.role || "user";
  const isAuthenticated = Boolean(session?.user);
  const isAdmin = isAuthenticated && actualRole === "admin";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-[#faf8f5]/90 backdrop-blur-md border-b border-[#e8e2d9] shadow-sm py-3"
          : "bg-[#faf8f5] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center transition-transform hover:scale-[1.02]">
          <Logo size="md" variant="full" theme="dark" />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/books"
            className="text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/categories"
            className="text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors"
          >
            Categories
          </Link>
          {isAuthenticated && (
            <Link
              href="/library"
              className="text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors"
            >
              My Library
            </Link>
          )}
          <a
            href="#how-it-works"
            className="text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-stone-700 hover:text-stone-950 transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* ONLY SHOW ADMIN DASHBOARD LINK TO VERIFIED ADMINS */}
          {isAdmin && (
            <Link
              href="/admin"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-900 text-amber-400 border border-amber-500/40 shadow-xs hover:bg-stone-800 transition-colors"
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>ADMIN PANEL</span>
            </Link>
          )}

          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-[#f2ece4] transition-colors"
            title="Search ebooks"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Sign In / My Library Link */}
          {isAuthenticated && session?.user ? (
            <Link
              href="/library"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 bg-white border border-[#d8d2c6] hover:bg-stone-100 transition-colors shadow-xs"
            >
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[10px] flex items-center justify-center">
                  {session.user.name?.[0] || "A"}
                </div>
              )}
              <span className="max-w-[100px] truncate">My Library</span>
            </Link>
          ) : (
            <button
              onClick={onOpenSignIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-stone-800 bg-white border border-[#d8d2c6] hover:bg-stone-100 transition-colors shadow-xs"
            >
              <User className="w-4 h-4 text-stone-600" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Icon Button */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center p-2.5 rounded-xl bg-stone-900 text-stone-100 hover:bg-stone-800 transition-all shadow-sm active:scale-95"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center justify-center border-2 border-[#faf8f5] shadow-sm animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 hover:bg-[#f2ece4] md:hidden"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#faf8f5] border-b border-[#e8e2d9] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-stone-950"
          >
            Browse Ebooks
          </Link>
          <Link
            href="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-stone-950"
          >
            Categories
          </Link>
          {isAuthenticated && (
            <Link
              href="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-stone-800 font-medium hover:text-stone-950"
            >
              My Library
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-amber-900 font-bold hover:text-amber-800"
            >
              Admin Control Panel
            </Link>
          )}
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-stone-950"
          >
            How it Works
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-stone-800 font-medium hover:text-stone-950"
          >
            FAQ
          </a>
        </div>
      )}
    </header>
  );
};
