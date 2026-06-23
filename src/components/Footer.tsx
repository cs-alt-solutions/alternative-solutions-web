/* src/components/Footer.tsx */
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Footer() {
  const pathname = usePathname();
  
  // ARCHITECTURE RULE: Hide public footer in command environments
  if (
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/login') || 
    pathname.startsWith('/sandbox') ||
    pathname.startsWith('/portal') 
  ) {
    return null;
  }

  // We only need the legal entity and tagline now
  const { LEGAL_ENTITY, TAGLINE } = WEBSITE_COPY.GLOBAL_FOOTER;

  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-black/20 text-center flex flex-col items-center">
      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-auto">
        © {new Date().getFullYear()} {LEGAL_ENTITY} {TAGLINE}
      </p>
    </footer>
  );
}