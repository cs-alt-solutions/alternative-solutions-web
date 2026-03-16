/* src/components/shift-studio/FeatureCards.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Terminal, Box, Banknote } from 'lucide-react';

// Maps to: Command, Workshop, Ledger
const ICONS = [Terminal, Box, Banknote];
const COLORS = [
    'text-brand-primary group-hover:bg-brand-primary', 
    'text-fuchsia-400 group-hover:bg-fuchsia-400', 
    'text-emerald-400 group-hover:bg-emerald-400'
];
const BGs = [
    'bg-brand-primary/10', 
    'bg-fuchsia-400/10', 
    'bg-emerald-400/10'
];
const BORDERS = [
    'hover:border-brand-primary/30 shadow-[0_0_15px_rgba(6,182,212,0)] hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    'hover:border-fuchsia-400/30 shadow-[0_0_15px_rgba(232,121,249,0)] hover:shadow-[0_0_20px_rgba(232,121,249,0.1)]',
    'hover:border-emerald-400/30 shadow-[0_0_15px_rgba(52,211,153,0)] hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]'
];

export default function FeatureCards() {
  const { SYSTEM_MODULES } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE.SECTORS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {SYSTEM_MODULES.map((card: any, index: number) => {
            const Icon = ICONS[index] || Terminal;
            return (
                <div key={index} className={`bg-white/2 border border-white/5 p-8 rounded-xl transition-all group ${BORDERS[index]}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-10 h-10 rounded flex items-center justify-center group-hover:text-black transition-all ${BGs[index]} ${COLORS[index]}`}>
                            <Icon size={20} />
                        </div>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest border border-white/10 px-2 py-0.5 rounded">
                            {card.STATUS}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{card.TITLE}</h3>
                    <p className="text-text-muted text-sm leading-relaxed font-light">{card.DESC}</p>
                </div>
            )
        })}
    </div>
  );
}