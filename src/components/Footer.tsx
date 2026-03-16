/* src/components/Footer.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import { TerminalSquare, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { LEGAL_ENTITY, TAGLINE, CTA } = WEBSITE_COPY.GLOBAL_FOOTER;

  // We check if the user is currently on the Lab page. 
  // If they are, we hide the CTA block because the 3 paths are already on that page.
  const showCTA = pathname !== '/blueprint';

  return (
    <footer className="pt-20 pb-10 px-6 border-t border-white/5 bg-black/20 text-center flex flex-col items-center">
      
      {/* Dynamic CTA Banner (Hidden on Blueprint Page) */}
      {showCTA && (
        <div className="w-full max-w-3xl mb-24 bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-md hover:border-brand-primary/30 transition-all duration-500 group relative overflow-hidden shadow-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
          
          <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(6,182,212,0.15)]">
             <TerminalSquare size={26} />
          </div>
          
          <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4">
            {CTA.TITLE}
          </h3>
          
          <p className="text-slate-400 font-light mb-10 max-w-lg mx-auto leading-relaxed">
            {CTA.DESC}
          </p>
          
          <Link 
            href={CTA.LINK} 
            className="inline-flex items-center justify-center gap-3 px-10 py-5 text-sm font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all group-hover:animate-pulse-subtle"
          >
            {CTA.BTN_TEXT} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      {/* The Legal Tagline */}
      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-auto">
        © {new Date().getFullYear()} {LEGAL_ENTITY} {TAGLINE}
      </p>
      
    </footer>
  );
}