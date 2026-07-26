"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { authClient } from "@/lib/auth-client";
import {
  BarChart3,
  BookOpen,
  Upload,
  Users,
  Settings,
  Shield,
  ArrowLeft,
  Layers,
  CheckCircle2,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const userRole = (session?.user as any)?.role || "user";

  useEffect(() => {
    if (!isPending) {
      // If user is not logged in OR is not an admin, redirect to storefront
      if (!session?.user || userRole !== "admin") {
        router.push("/?auth_error=admin_required");
      }
    }
  }, [session, isPending, userRole, router]);

  // Loading spinner during session check
  if (isPending) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-8 text-stone-700">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-3" />
        <span className="text-xs font-mono font-semibold">Verifying Admin Permissions...</span>
      </div>
    );
  }

  // Access Denied Fallback if not admin
  if (!session?.user || userRole !== "admin") {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-8 text-stone-900 space-y-4">
        <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-stone-900">
          Admin Access Restricted
        </h2>
        <p className="text-xs text-stone-600 font-mono text-center max-w-sm">
          You must be authenticated with an <strong>Admin Role</strong> account to access the control panel.
        </p>
        <Link
          href="/"
          className="px-4 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors"
        >
          Return to Storefront
        </Link>
      </div>
    );
  }

  const NAV_ITEMS = [
    { href: "/admin", label: "Analytics Overview", icon: BarChart3 },
    { href: "/admin/catalog", label: "Ebook Catalog", icon: BookOpen },
    { href: "/admin/upload", label: "Upload PDF & EPUB", icon: Upload, highlight: true },
    { href: "/admin/users", label: "Users & Roles", icon: Users },
    { href: "/admin/settings", label: "ImageKit & System", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#f5f2eb] text-[#1a1918] flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-stone-950 text-stone-100 px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Logo size="md" variant="full" theme="light" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            <span>CURATOR ADMIN CONTROL PANEL</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 transition-colors border border-stone-700"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Switch to Storefront</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Admin Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#e5decb] shadow-sm space-y-1">
            <div className="text-[11px] font-mono uppercase text-stone-400 px-3 py-2">
              Admin Navigation Routes
            </div>

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-stone-900 text-amber-400 shadow-sm"
                      : "text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ImageKit Hosting Banner */}
          <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold font-mono">
              <Layers className="w-4 h-4" />
              <span>IMAGEKIT HOSTING</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              PDF, EPUB, and Cover assets are securely hosted on ImageKit with global CDN distribution.
            </p>
            <div className="text-xs font-mono text-emerald-400 pt-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>CDN Active & Healthy</span>
            </div>
          </div>
        </aside>

        {/* Page Content */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
