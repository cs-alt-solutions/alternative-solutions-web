/* src/components/Navbar.tsx */
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5 bg-black/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-500 rounded-sm" />
          <span className="font-bold text-lg tracking-tight uppercase">
            {WEBSITE_COPY.NAV.BRAND}
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/shift-studio" className="text-xs font-mono text-zinc-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">
            {WEBSITE_COPY.NAV.SHIFT_STUDIO}
          </Link>
          <Link href="/architect" className="text-xs font-mono text-zinc-400 hover:text-cyan-400 uppercase tracking-widest transition-colors">
            {WEBSITE_COPY.NAV.ARCHITECT}
          </Link>
        </div>

        <button className="md:hidden text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-b border-white/5 flex flex-col p-6 gap-6">
          <Link href="/shift-studio" onClick={() => setIsOpen(false)} className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            {WEBSITE_COPY.NAV.SHIFT_STUDIO}
          </Link>
          <Link href="/architect" onClick={() => setIsOpen(false)} className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            {WEBSITE_COPY.NAV.ARCHITECT}
          </Link>
        </div>
      )}
    </nav>
  );
}