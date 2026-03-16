/* src/components/Footer.tsx */
import React from 'react';
import SupportCard from './core/SupportCard';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Footer() {
  const { LEGAL_ENTITY, TAGLINE } = WEBSITE_COPY.GLOBAL_FOOTER;

  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-black/20 text-center flex flex-col items-center gap-12">
      
      {/* The Support Module - Fully Active */}
      <div className="w-full flex justify-center">
        <SupportCard />
      </div>

      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} {LEGAL_ENTITY} {TAGLINE}
      </p>
    </footer>
  );
}