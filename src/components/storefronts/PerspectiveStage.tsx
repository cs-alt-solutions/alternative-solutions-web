'use client';

import React, { useState } from 'react';
import PrototypeCard from './PrototypeCard';
import { STOREFRONTS } from '@/config/marketing/sector-zero';

const VIBE_KEYWORDS: Record<string, string[]> = {
  "Industrial": ["industrial", "raw"],
  "Neo-Brutalist": ["neo", "brutalist"],
  "Cyberpunk": ["cyberpunk", "neon", "tech"],
  "Minimalist": ["minimal", "minimalist", "clean"],
  "Elegant": ["elegant", "high"],
  "Organtic": ["organic", "organtic", "earthy", "natural"],
  "Editorial": ["editorial", "magazine", "classic"],
  "Midnight Onyx": ["midnight", "onyx", "dark"]
};

interface PerspectiveStageProps {
  prototypes: any[];
}

export default function PerspectiveStage({ prototypes }: PerspectiveStageProps) {
  const { GALLERY } = STOREFRONTS;
  const [activeCategory, setActiveCategory] = useState(GALLERY.VIBES[0]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false); // 🚀 Mobile & Flip Freeze State

  const isAllVibes = activeCategory === GALLERY.VIBES[0];

  const filteredPrototypes = isAllVibes 
    ? prototypes 
    : prototypes.filter(site => {
        const keywords = VIBE_KEYWORDS[activeCategory] || [activeCategory.toLowerCase()];
        const combinedDbString = [
          site.theme_style,
          site.selected_vibe,
          site.vibe,
          site.category
        ].filter(Boolean).join(" ").toLowerCase();

        return keywords.some(kw => combinedDbString.includes(kw));
      });

  const getReelTrack = (items: any[]) => {
    if (!isAllVibes || items.length === 0) return items;
    if (items.length <= 2) return [...items, ...items, ...items, ...items, ...items, ...items];
    if (items.length <= 4) return [...items, ...items, ...items, ...items];
    return [...items, ...items, ...items];
  };

  const reelTrack = getReelTrack(filteredPrototypes);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 3D VIEWPORT STAGE */}
      <div className="w-full overflow-hidden relative py-12 perspective-distant">
        
        {/* Cinematic Edge Fade Masks */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-linear-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-linear-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

        {filteredPrototypes.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-sm tracking-widest uppercase">
            {GALLERY.SECTOR_EMPTY_PRE} <span className="text-cyan-400 font-bold">{activeCategory}</span> {GALLERY.SECTOR_EMPTY_POST}
          </div>
        ) : (
          /* 
            🚀 CANONICAL TAILWIND PAUSE: 
            Applies [animation-play-state:paused] whenever hovered OR touched OR when any card reports isFlipped = true!
          */
          <div className={`
            flex py-6
            ${isAllVibes 
              ? `w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] ${(hoveredIndex !== null || isPaused) ? '[animation-play-state:paused]' : ''} pl-4` 
              : 'w-full justify-center items-center px-4 flex-wrap md:flex-nowrap gap-4 md:gap-0'}
          `}>
            {reelTrack.map((site, index) => {
              const isHovered = hoveredIndex === index;
              const isLeft = hoveredIndex !== null && index < hoveredIndex;
              const isRight = hoveredIndex !== null && index > hoveredIndex;

              return (
                <div
                  key={`${site.id}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => setHoveredIndex(index)} // 🚀 Mobile Touch Binding
                  className={`
                    w-90 md:w-115 lg:w-125 shrink-0 transition-all duration-500 ease-out cursor-pointer -mx-3 md:-mx-5
                    ${isHovered ? 'z-40 opacity-100 shadow-[0_30px_70px_rgba(34,211,238,0.25)] transform-[rotateY(0deg)_scale(1.05)_translateZ(40px)]' : ''}
                    ${isLeft ? 'opacity-65 transform-[rotateY(25deg)_scale(0.88)]' : ''}
                    ${isRight ? 'opacity-65 transform-[rotateY(-25deg)_scale(0.88)]' : ''}
                    ${hoveredIndex === null ? 'opacity-85 transform-[rotateY(0deg)_scale(0.95)] hover:opacity-100 hover:transform-[rotateY(0deg)_scale(1.02)_translateZ(10px)] z-10' : ''}
                  `}
                >
                  <PrototypeCard 
                    site={site} 
                    onFlipChange={(flipped) => setIsPaused(flipped)} 
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive 8-Vibe Category Dock */}
      <div className="mt-4 px-6 py-3 rounded-full bg-zinc-950/90 border border-zinc-800/80 flex flex-wrap justify-center items-center gap-2 md:gap-3 shadow-2xl backdrop-blur-md z-30 max-w-5xl">
        {GALLERY.VIBES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setHoveredIndex(null);
                setIsPaused(false); // Reset pause state when switching sectors
              }}
              className={`
                px-4 py-2 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300
                ${isActive 
                  ? 'bg-cyan-400 text-zinc-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105' 
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}
              `}
            >
              {category}
            </button>
          );
        })}
      </div>

    </div>
  );
}