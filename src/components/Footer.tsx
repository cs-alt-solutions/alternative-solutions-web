/* src/components/Footer.tsx */
import React from 'react';

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5 bg-black/20 text-center">
      <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
        © {new Date().getFullYear()} Alternative Solutions. Built by Humans.
      </p>
    </footer>
  );
}