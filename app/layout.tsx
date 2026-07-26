import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import { StoreProvider } from "@/lib/store-context";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.aivv.app"),
  title: "AIVV Store — Digital Ebook Marketplace | Read Instantly & Own Forever",
  description:
    "A clean, focused store for buying and reading ebooks instantly in your browser or downloading DRM-free PDF/EPUB. No physical shipping, ever.",
  keywords: [
    "ebook marketplace",
    "digital books",
    "in-browser reader",
    "DRM-free PDF EPUB",
    "AIVV Store",
    "read online ebooks",
    "digital bookstore",
    "aivv app",
  ],
  authors: [{ name: "AIVV Store" }],
  alternates: {
    canonical: "https://www.aivv.app",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "AIVV Store — Read Instantly. Own Forever.",
    description:
      "Buy & read premium digital ebooks directly in your browser or download DRM-free PDF and EPUB files instantly.",
    type: "website",
    url: "https://www.aivv.app",
    siteName: "AIVV Store",
    images: [
      {
        url: "/logo.svg",
        width: 512,
        height: 512,
        alt: "AIVV Store Monogram Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVV Store — Digital Ebook Marketplace",
    description: "Buy & read premium digital ebooks directly in your browser tab.",
    images: ["/logo.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AIVV Store",
    url: "https://www.aivv.app",
    logo: "https://www.aivv.app/logo.svg",
    description:
      "Digital-only ebook marketplace for instant in-browser reading and DRM-free PDF/EPUB downloads.",
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AIVV Store",
    url: "https://www.aivv.app",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.aivv.app/#browse?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable} scroll-smooth antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[#faf8f5] text-[#1a1918] font-sans selection:bg-[#f3ead8] selection:text-[#1a1918] flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
