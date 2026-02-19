/* src/components/shift-studio/FeatureCards.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Box, TrendingUp, Share2 } from 'lucide-react';

const ICONS = [Box, TrendingUp, Share2];

export default function FeatureCards() {
  const { CARDS } = WEBSITE_COPY.JOIN_PAGE.HYPE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
        {CARDS.map((card: any, index: number) => {
            const Icon = ICONS[index];
            return (
                <div key={index} className="bg-bg-surface-100 border border-border-subtle p-8 rounded-xl hover:border-brand-primary/30 transition-colors group">
                    <div className="w-10 h-10 rounded bg-bg-surface-200 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 group-hover:text-brand-primary transition-all">
                        <Icon size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">{card.TITLE}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{card.DESC}</p>
                </div>
            )
        })}
    </div>
  );
}