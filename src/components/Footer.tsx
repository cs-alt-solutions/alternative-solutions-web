/* src/components/Footer.tsx */
import React from 'react';
import SupportCard from './core/SupportCard';

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/5 bg-black/20 text-center flex flex-col items-center gap-12">
      
      {/* The Support Module - Fully Active */}
      <div className="w-full flex justify-center">
        <SupportCard />
      </div>

      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} Alternative Solutions. Built by Humans.
      </p>
    </footer>
  );
}