"use client";

import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
  theme?: "dark" | "light";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "full",
  theme = "dark",
  className = "",
}) => {
  const iconDimensions = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* SVG Icon Mark */}
      <div className={`relative ${iconDimensions[size]} shrink-0 rounded-xl overflow-hidden shadow-sm`}>
        <svg viewBox="0 0 128 128" className="w-full h-full">
          <defs>
            <linearGradient id="logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <rect width="128" height="128" rx="28" fill={theme === "light" ? "#ffffff" : "#171615"} />
          {/* Left Book Page */}
          <path
            d="M 64 24 C 48 16 28 22 20 28 L 20 92 C 28 86 48 80 64 88 Z"
            fill={theme === "light" ? "#f5af33" : "#faf8f5"}
            opacity="0.95"
          />
          {/* Right Book Page */}
          <path
            d="M 64 24 C 80 16 100 22 108 28 L 108 92 C 100 86 80 80 64 88 Z"
            fill={theme === "light" ? "#e59b20" : "#f4efea"}
            opacity="0.88"
          />
          {/* Gold Ribbon Spine */}
          <path d="M 64 24 L 64 104 L 72 96 L 80 104 L 80 24 Z" fill="url(#logo-gold)" />
          {/* Monogram A */}
          <path
            d="M 64 38 L 42 86 L 52 86 L 64 62 L 76 86 L 86 86 Z"
            fill={theme === "light" ? "#171615" : "#171615"}
          />
        </svg>
      </div>

      {/* Logotype */}
      {variant === "full" && (
        <div className="flex flex-col leading-none">
          <span
            className={`font-serif font-bold tracking-tight ${textSizes[size]} ${
              theme === "light" ? "text-white" : "text-stone-900"
            } flex items-center gap-1.5`}
          >
            AIVV Store
            <span className="text-[9px] font-sans font-medium px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
              Digital
            </span>
          </span>
          <span
            className={`text-[9px] font-sans font-semibold tracking-widest uppercase mt-0.5 ${
              theme === "light" ? "text-stone-400" : "text-stone-500"
            }`}
          >
            Instant Reader Marketplace
          </span>
        </div>
      )}
    </div>
  );
};
