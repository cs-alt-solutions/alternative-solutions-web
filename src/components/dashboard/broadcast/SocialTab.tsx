/* src/components/dashboard/broadcast/SocialTab.tsx */
import React from 'react';
import { Share2 } from 'lucide-react';

export default function SocialTab() {
  return (
    <section className="flex flex-col items-center justify-center p-20 border border-dashed border-white/10 rounded-2xl bg-black/20 animate-in fade-in duration-500">
      <Share2 size={32} className="text-white/20 mb-4" />
      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
        Social API Integrations Pending Initialization...
      </p>
    </section>
  );
}