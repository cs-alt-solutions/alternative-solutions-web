/* src/components/dashboard/DashboardMobileHeader.tsx */
'use client';

import React from 'react';
import { Menu, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  toggleMenu: () => void;
}

export default function DashboardMobileHeader({ isOpen, toggleMenu }: Props) {
  return (
    <div className="md:hidden flex items-center justify-between bg-bg-surface-100 border-b border-white/5 h-16 px-6 z-40 sticky top-0 shrink-0">
      <div className="text-lg font-black text-white italic tracking-tighter uppercase truncate">
        Alt Solutions
      </div>
      <button
        onClick={toggleMenu}
        className="p-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-sm"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} className="text-brand-primary" />}
      </button>
    </div>
  );
}