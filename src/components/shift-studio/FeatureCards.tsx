import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Box, Layout, Cpu } from 'lucide-react';

const ICONS = [Box, Layout, Cpu];

export default function FeatureCards() {
  const { SYSTEM_MODULES } = WEBSITE_COPY.SHIFT_STUDIO_PAGE.SECTORS;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {SYSTEM_MODULES.map((card: any, index: number) => {
            const Icon = ICONS[index] || Cpu;
            return (
                <div key={index} className="bg-white/2 border border-white/5 p-8 rounded-xl hover:border-brand-primary/30 transition-all group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-all">
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