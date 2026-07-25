'use client';

import React, { useState } from 'react';
import PrototypeCard from './PrototypeCard';

const VIBE_CATEGORIES = [
  "All Builds",
  "Raw & Industrial",
  "Midnight Onyx",
  "Retro Pop",
  "Clean & Minimal",
  "Neo-Brutalist"
];

interface PerspectiveStageProps {
  prototypes: any[];
}

export default function PerspectiveStage({ prototypes }: PerspectiveStageProps) {
  const [activeCategory, setActiveCategory] = useState("All Builds");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 1. Clean Category Filtering
  const filteredPrototypes = activeCategory === "All Builds" 
    ? prototypes 
    : prototypes.filter(site => site.vibe === activeCategory || site.category === activeCategory);

  // 2. 🚀 DYNAMIC INFINITE TRACK: Automatically scales duplication so small category lists never show blank voids!
  const getReelTrack = (items: any[]) => {
    if (items.length === 0) return [];
    if (items.length <= 2) return [...items, ...items, ...items, ...items, ...items, ...items];
    if (items.length <= 4) return [...items, ...items, ...items, ...items];
    return [...items, ...items, ...items];
  };

  const reelTrack = getReelTrack(filteredPrototypes);

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 🚀 3D VIEWPORT STAGE: Canonical perspective-distant locks in physical Z/Y depth */}
      <div className="w-full overflow-hidden relative py-12 perspective-distant">
        
        {/* Cinematic Edge Fade Masks using canonical bg-linear-to-r / bg-linear-to-l */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-linear-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-linear-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

        {filteredPrototypes.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-sm tracking-widest uppercase">
            No prototypes found in this vibe sector.
          </div>
        ) : (
          /* Infinite Marquee Track: Smooth linear glide that locks in place instantly on hover */
          <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused] py-6 pl-4">
            {reelTrack.map((site, index) => {
              const isHovered = hoveredIndex === index;
              const isLeft = hoveredIndex !== null && index < hoveredIndex;
              const isRight = hoveredIndex !== null && index > hoveredIndex;

              return (
                <div
                  key={`${site.id}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  /* 
                    3D STADIUM COVERFLOW ARCHITECTURE:
                    - Larger Footprint: Upgraded to w-90, md:w-115, lg:w-125 (up to 500px wide!)
                    - Constant Overlap: -mx-3 md:-mx-5 applied permanently to eliminate layout jitter
                    - Aggressive Tilt: Cranked rotation up to 25deg for a dramatic amphitheater curve
                    - Pure GPU Transforms: Only transforms and opacity change on hover (zero layout stutter)
                  */
                  className={`
                    w-90 md:w-115 lg:w-125 shrink-0 transition-all duration-500 ease-out cursor-pointer -mx-3 md:-mx-5
                    ${isHovered ? 'z-40 opacity-100 shadow-[0_30px_70px_rgba(34,211,238,0.25)] transform-[rotateY(0deg)_scale(1.05)_translateZ(40px)]' : ''}
                    ${isLeft ? 'opacity-65 transform-[rotateY(25deg)_scale(0.88)]' : ''}
                    ${isRight ? 'opacity-65 transform-[rotateY(-25deg)_scale(0.88)]' : ''}
                    ${hoveredIndex === null ? 'opacity-85 transform-[rotateY(0deg)_scale(0.95)] hover:opacity-100 hover:transform-[rotateY(0deg)_scale(1.02)_translateZ(10px)] z-10' : ''}
                  `}
                >
                  <PrototypeCard site={site} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Category Dock */}
      <div className="mt-4 px-6 py-3 rounded-full bg-zinc-950/90 border border-zinc-800/80 flex flex-wrap justify-center items-center gap-2 md:gap-4 shadow-2xl backdrop-blur-md z-30">
        {VIBE_CATEGORIES.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setHoveredIndex(null);
              }}
              className={`
                px-5 py-2 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300
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