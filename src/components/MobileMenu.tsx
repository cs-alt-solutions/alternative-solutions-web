/* src/components/MobileMenu.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY, ROUTES } from '@/utils/glossary';
import { Menu, X, User } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="flex md:hidden items-center gap-4 shrink-0 relative z-50">
      
      {/* Mobile Portal Link */}
      <Link 
        href={ROUTES.PUBLIC.LOGIN} 
        onClick={closeMenu} 
        className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest shrink-0"
      >
        <User size={12} /> <span className="hidden sm:inline">Portal</span>
      </Link>

      {/* Hamburger Toggle Button */}
      <button 
        onClick={toggleMenu} 
        className="text-slate-300 hover:text-white transition-colors p-2 -mr-2 shrink-0" 
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Slide-Down Dropdown (Fixed to always span viewport) */}
      <div 
        className={`fixed top-20 left-0 w-full bg-black/95 backdrop-blur-2xl border-b border-white/10 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-125 py-6 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-6 px-6">
          <Link 
            href="https://storefronts.alternativesolutions.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={closeMenu} 
            className="px-6 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-lg font-black transition-all uppercase tracking-widest w-full text-center"
          >
            {WEBSITE_COPY.NAV.STOREFRONTS}
          </Link>
          <Link 
            href={ROUTES.PUBLIC.PRODUCTS.ROOT} 
            onClick={closeMenu} 
            className="text-lg font-black text-slate-300 hover:text-amber-400 transition-all uppercase tracking-widest w-full text-center"
          >
            {WEBSITE_COPY.NAV.ECOSYSTEM}
          </Link>
          <Link 
            href={ROUTES.PUBLIC.FOUNDER} 
            onClick={closeMenu} 
            className="text-lg font-black text-slate-300 hover:text-fuchsia-400 transition-all uppercase tracking-widest w-full text-center"
          >
            {WEBSITE_COPY.NAV.STORY}
          </Link>
        </div>
      </div>
    </div>
  );
}