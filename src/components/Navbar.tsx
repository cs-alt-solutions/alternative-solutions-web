/* src/components/Navbar.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Navbar() {
  const [hasAccess, setHasAccess] = useState(false);
  const nav = WEBSITE_COPY.NAV;

  useEffect(() => {
    const checkAccess = () => {
      const access = localStorage.getItem('alt_solutions_access');
      setHasAccess(!!access);
    };

    checkAccess();
    window.addEventListener('storage', checkAccess);
    window.addEventListener('accessGranted', checkAccess);
    
    return () => {
      window.removeEventListener('storage', checkAccess);
      window.removeEventListener('accessGranted', checkAccess);
    };
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:bg-white transition-colors" />
          <span className="font-bold text-sm md:text-lg tracking-tight uppercase text-white group-hover:text-brand-primary transition-colors">
            {nav.BRAND}
          </span>
        </Link>

        {/* REVEALED NAV: Visible on all screens once access is granted */}
        {hasAccess && (
          <div className="flex items-center gap-4 md:gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
            <Link 
              href="/architect" 
              className="text-[9px] md:text-[10px] font-mono text-white/60 hover:text-brand-primary transition-colors uppercase tracking-widest md:tracking-[0.2em] whitespace-nowrap"
            >
              {nav.ARCHITECT}
            </Link>
            <Link 
              href="/shift-studio" 
              className="text-[9px] md:text-[10px] font-mono text-white/60 hover:text-brand-primary transition-colors uppercase tracking-widest md:tracking-[0.2em] whitespace-nowrap"
            >
              {nav.SHIFT_STUDIO}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}