'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
      
      {/* The Legal Navigation Row
        These are completely distinct from the main App routes, so hardcoding the paths 
        is acceptable here to prevent polluting the primary ROUTES config object. 
      */}
      <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest uppercase text-white/50 mb-6">
        <Link href="/legal/terms" className="hover:text-cyan-400 transition-colors duration-300">
          Terms of Service
        </Link>
        <Link href="/legal/privacy" className="hover:text-cyan-400 transition-colors duration-300">
          Privacy Policy
        </Link>
        <Link href="/legal/disclaimer" className="hover:text-cyan-400 transition-colors duration-300">
          Disclaimer
        </Link>
      </div>

      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-auto">
        © {new Date().getFullYear()} {LEGAL_ENTITY} {TAGLINE}
      </p>
    </footer>
  );
}