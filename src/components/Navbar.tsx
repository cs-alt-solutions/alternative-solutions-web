/* src/components/Navbar.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border-subtle bg-bg-app/80">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 z-50" onClick={() => setIsOpen(false)}>
          <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="font-bold text-lg tracking-tight uppercase">{WEBSITE_COPY.NAV.BRAND}</span>
        </Link>

        {/* DESKTOP NAVIGATION (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/#services" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SERVICES}</Link>
          <Link href="/shift-studio" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SHIFT_STUDIO}</Link>
          <Link href="/dashboard" className="px-5 py-2 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wide">
            {WEBSITE_COPY.NAV.LOGIN}
          </Link>
        </div>

        {/* MOBILE TOGGLE BUTTON (Hidden on Desktop) */}
        <button 
          className="md:hidden p-2 text-text-muted hover:text-white transition-colors z-50"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE DROP-DOWN MENU */}
      <div 
        className={`md:hidden absolute top-20 left-0 w-full bg-bg-app/95 backdrop-blur-xl border-b border-border-subtle transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible'
        }`}
      >
        <div className="flex flex-col px-6 py-8 space-y-6 text-center shadow-2xl">
          <Link href="/#services" onClick={toggleMenu} className="text-sm font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">
            {WEBSITE_COPY.NAV.SERVICES}
          </Link>
          <Link href="/shift-studio" onClick={toggleMenu} className="text-sm font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">
            {WEBSITE_COPY.NAV.SHIFT_STUDIO}
          </Link>
          <div className="pt-6 mt-2 border-t border-white/5">
            <Link href="/dashboard" onClick={toggleMenu} className="inline-block px-8 py-3 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wide">
              {WEBSITE_COPY.NAV.LOGIN}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}