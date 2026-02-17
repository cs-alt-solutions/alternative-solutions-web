/* src/components/Navbar.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* The singular anchor point. */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.3)] group-hover:bg-white transition-colors" />
          <span className="font-bold text-lg tracking-tight uppercase text-white group-hover:text-brand-primary transition-colors">
            {WEBSITE_COPY.NAV.BRAND}
          </span>
        </Link>

        {/* Navigation links to Shift Studio and The Architect have been intentionally removed. 
          We are operating on a Dark URL protocol. Access is granted, not found. 
        */}
      </div>
    </nav>
  );
}