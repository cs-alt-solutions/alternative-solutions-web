// src/components/storefronts/PrototypeGrid.tsx
'use client';

import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function PrototypeGrid({ prototypes }: { prototypes: any[] }) {
  const [activeVibe, setActiveVibe] = useState('ALL');

  // Hardcoded core vibes so you can see what's missing and what's populated
  const ALL_VIBES = [
    'ALL', 'industrial', 'neo-brutalist', 'cyberpunk', 
    'minimalist', 'elegant', 'organic', 'editorial'
  ];

  const filteredPrototypes = activeVibe === 'ALL' 
    ? prototypes 
    : prototypes.filter(p => p.theme_style === activeVibe);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 px-6">
      
      {/* 🟢 VIBE FILTER TABS */}
      <div className="flex flex-wrap justify-center gap-2">
        {ALL_VIBES.map((vibe) => (
          <button
            key={vibe}
            onClick={() => setActiveVibe(vibe)}
            className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              activeVibe === vibe 
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)] scale-105' 
                : 'bg-zinc-900/80 text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            {vibe.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* 🟢 3-COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-6">
        {filteredPrototypes.map((site) => {
          const liveUrl = site.custom_domain 
            ? `https://${site.custom_domain}` 
            : `https://storefronts.alternativesolutions.io/${site.slug}`;

          return (
            <a 
              key={site.id}
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden shadow-xl transition-all block flex-col"
            >
              {/* Card Image */}
              <div className="aspect-video relative overflow-hidden bg-zinc-900 border-b border-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={site.hero_image} 
                  alt={site.business_name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-transparent to-transparent opacity-90" />
                
                {/* Vibe Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">
                     {site.theme_style?.replace('-', ' ') || 'STANDARD'}
                   </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2 group-hover:text-cyan-400 transition-colors">
                  {site.business_name}
                </h3>
                <p className="text-sm text-zinc-400 line-clamp-2 flex-1">
                  {site.tagline || 'Experience the future of digital storefronts.'}
                </p>

                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                  View Storefront <ExternalLink size={12} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Empty State Fallback */}
      {filteredPrototypes.length === 0 && (
         <div className="text-center py-20 border border-dashed border-zinc-800/80 rounded-2xl mt-4 bg-zinc-900/20">
            <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              No architectural prototypes built for this aesthetic yet.
            </p>
         </div>
      )}

    </div>
  );
}