/* src/components/Navbar.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-bg-app/70 font-sans">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* THE BRAND (HOME) */}
        <Link href="/" className="flex items-center gap-4 group shrink-0">
          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] group-hover:bg-fuchsia-400 group-hover:shadow-[0_0_15px_rgba(232,121,249,0.5)] transition-all duration-500" />
          <span className="font-black text-lg md:text-xl tracking-widest text-white group-hover:text-cyan-400 transition-colors duration-300 uppercase">
            {WEBSITE_COPY.NAV.BRAND}
          </span>
        </Link>

        <div className="flex items-center gap-8 md:gap-10">
          
          {/* PUBLIC LINKS */}
          <div className="hidden md:flex items-center gap-8 font-bold text-xs">
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

          {/* THE BETA FUNNEL: The glowing CTA */}
          <Link 
            href="/blueprint" 
            className="text-xs font-bold text-emerald-400 border border-emerald-500/50 hover:bg-emerald-400 hover:text-black px-5 py-2.5 rounded-lg transition-all shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_30px_rgba(52,211,153,0.4)] ml-2 uppercase tracking-widest"
          >
            {WEBSITE_COPY.NAV.BETA_CENTER}
          </Link>

        </div>
      </div>
    </nav>
  );
}