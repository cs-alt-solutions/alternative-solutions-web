/* src/components/ServiceCard.tsx */
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ServiceCardProps {
  TITLE: string;
  PRICE: string;
  DESC: string;
  FEATURES: string[]; // Strict adherence to the new detail-rich architecture
  accent: 'teal' | 'blue' | 'purple'; 
}

export default function ServiceCard({ TITLE, PRICE, DESC, FEATURES, accent }: ServiceCardProps) {
  const accentClasses = {
    teal: "border-brand-primary/20 text-brand-primary bg-brand-primary/5",
    blue: "border-brand-secondary/20 text-brand-secondary bg-brand-secondary/5",
    purple: "border-brand-accent/20 text-brand-accent bg-brand-accent/5",
  };

  return (
    /* FIXED: Using canonical Tailwind v4 class min-h-112.5 */
    <div className="p-8 rounded-2xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-300 group flex flex-col min-h-112.5">
      <div className="mb-6">
        <span className={`text-[10px] font-mono px-2 py-1 rounded uppercase mb-4 inline-block border ${accentClasses[accent]}`}>
          {PRICE}
        </span>
        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-brand-accent transition-colors uppercase tracking-tight">
          {TITLE}
        </h3>
        <p className="text-text-muted leading-relaxed font-light text-sm mb-8">
          {DESC}
        </p>

        {/* Feature List for added details */}
        <ul className="space-y-3 pt-6 border-t border-white/5">
          {FEATURES.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 size={14} className="mt-1 shrink-0 opacity-70" />
              <span className="text-xs text-text-muted font-mono uppercase tracking-wider leading-tight">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto pt-8">
        <button className="w-full py-3 rounded border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-colors">
          Select Tier
        </button>
      </div>
    </div>
  );
}