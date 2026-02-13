/* src/app/layout.tsx */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Alternative Solutions",
  description: "Smarter Business Systems for entrepreneurs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="antialiased bg-bg-app text-white">
        <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border-subtle bg-bg-app/80">
          <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
              <span className="font-bold text-lg tracking-tight uppercase">{WEBSITE_COPY.NAV.BRAND}</span>
            </Link>
            <div className="hidden md:flex gap-8">
              <Link href="/services" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SERVICES}</Link>
              <Link href="/shift-studio" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SHIFT_STUDIO}</Link>
            </div>
            <Link href="/login" className="px-5 py-2 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wide">
              {WEBSITE_COPY.NAV.LOGIN}
            </Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}