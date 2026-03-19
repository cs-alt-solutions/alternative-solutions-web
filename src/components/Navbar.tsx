/* src/components/Navbar.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // ARCHITECTURE RULE: Hide public navigation in command environments
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-bg-app/80 font-sans transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* THE BRAND (HOME) */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-3 group shrink-0 relative z-50">
          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:bg-fuchsia-400 group-hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all duration-500" />
          <span className="font-black text-lg md:text-xl tracking-widest text-white group-hover:text-cyan-400 transition-colors duration-300 uppercase">
            {WEBSITE_COPY.NAV.BRAND}
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8 font-bold text-xs">
            <Link 
              href="/products" 
              className="text-slate-300 hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-300 uppercase tracking-widest"
            >
              {WEBSITE_COPY.NAV.ECOSYSTEM}
            </Link>
            
            <Link 
              href="/founder" 
              className="text-slate-300 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.8)] transition-all duration-300 uppercase tracking-widest"
            >
              {WEBSITE_COPY.NAV.STORY}
            </Link>
          </div>

          {/* THE BETA FUNNEL */}
          <Link 
            href="/blueprint" 
            className="text-xs font-bold text-emerald-400 border border-emerald-500/50 hover:bg-emerald-400 hover:text-black px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] uppercase tracking-widest"
          >
            {WEBSITE_COPY.NAV.BETA_CENTER}
          </Link>
        </div>

        {/* MOBILE MENU BUTTON & LAB CTA */}
        <div className="flex md:hidden items-center gap-4 relative z-50">
          <Link 
            href="/blueprint" 
            onClick={closeMenu}
            className="text-[10px] font-bold text-emerald-400 border border-emerald-500/50 hover:bg-emerald-400 hover:text-black px-3 py-1.5 rounded-lg transition-all shadow-[0_0_15px_rgba(52,211,153,0.15)] uppercase tracking-widest"
          >
            {WEBSITE_COPY.NAV.BETA_CENTER}
          </Link>
          
          <button 
            onClick={toggleMenu}
            className="text-slate-300 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-100 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8 px-6">
          <Link 
            href="/products" 
            onClick={closeMenu}
            className="text-lg font-black text-slate-300 hover:text-amber-400 transition-all uppercase tracking-widest w-full text-center"
          >
            {WEBSITE_COPY.NAV.ECOSYSTEM}
          </Link>
          
          <div className="w-8 h-px bg-white/10" />

          <Link 
            href="/founder" 
            onClick={closeMenu}
            className="text-lg font-black text-slate-300 hover:text-fuchsia-400 transition-all uppercase tracking-widest w-full text-center"
          >
            {WEBSITE_COPY.NAV.STORY}
          </Link>
        </div>
      </div>
    </nav>
  );
}