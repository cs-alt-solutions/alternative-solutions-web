/* src/components/Navbar.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY, ROUTES } from '@/utils/glossary';
import { User } from 'lucide-react';
import MobileMenu from './MobileMenu'; // Import the new component!

export default function Navbar() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login') || pathname.startsWith('/sandbox') || pathname.startsWith('/portal')) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b border-white/5 bg-bg-app/80 font-sans transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* THE BRAND (HOME) */}
        <Link href={ROUTES.PUBLIC.HOME} className="flex items-center group shrink-0 relative z-50 overflow-hidden">
          <div className="flex items-center bg-white/5 rounded-full pr-4 sm:pr-5 hover:bg-white/10 transition-all duration-500 shadow-sm hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] max-w-full">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-500 z-10 shrink-0">
              <img src="/logo.png" alt="Alternative Solutions Logo" className="absolute top-0 left-0 w-full h-full object-cover scale-[1.8]" />
            </div>
            <span className="font-black text-sm sm:text-lg md:text-xl tracking-widest text-white group-hover:text-cyan-400 transition-colors duration-300 uppercase ml-2 sm:ml-3 truncate">
              {WEBSITE_COPY.NAV.BRAND}
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION - STOREFRONTS LEADING THE CHARGE */}
        <div className="hidden md:flex items-center gap-8 shrink-0">
          <div className="flex items-center gap-8 font-bold text-xs">
            {/* Primary Revenue Driver */}
            <Link 
              href="https://storefronts.alternativesolutions.io" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-300 uppercase tracking-widest"
            >
              {WEBSITE_COPY.NAV.STOREFRONTS}
            </Link>

            {/* Ecosystem & Architect Supporting */}
            <Link href={ROUTES.PUBLIC.PRODUCTS.ROOT} className="text-slate-300 hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] transition-all duration-300 uppercase tracking-widest">
              {WEBSITE_COPY.NAV.ECOSYSTEM}
            </Link>
            <Link href={ROUTES.PUBLIC.FOUNDER} className="text-slate-300 hover:text-fuchsia-400 hover:drop-shadow-[0_0_8px_rgba(232,121,249,0.8)] transition-all duration-300 uppercase tracking-widest">
              {WEBSITE_COPY.NAV.STORY}
            </Link>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex items-center gap-5">
            <Link href={ROUTES.PUBLIC.LOGIN} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest">
              <User size={14} /> Portal
            </Link>
          </div>
        </div>

        {/* MOBILE NAVIGATION COMPONENT */}
        <MobileMenu />
        
      </div>
    </nav>
  );
}