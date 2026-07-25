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

  const filteredPrototypes = activeCategory === "All Builds" 
    ? prototypes 
    : prototypes.filter(site => site.vibe === activeCategory || site.category === activeCategory);

  // 🚀 INFINITE TRACK ARMOR: Duplicate 4x to guarantee seamless looping across ultra-wide monitors
  const reelTrack = [
    ...filteredPrototypes,
    ...filteredPrototypes,
    ...filteredPrototypes,
    ...filteredPrototypes
  ];

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* 🚀 3D VIEWPORT STAGE: Using canonical perspective-distant for physical Z/Y depth */}
      <div className="w-full overflow-hidden relative py-8 perspective-distant">
        
        {/* Cinematic Edge Fade Masks using canonical bg-linear-to-r / bg-linear-to-l */}
        <div className="absolute top-0 left-0 w-16 md:w-40 h-full bg-linear-to-r from-zinc-950 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-40 h-full bg-linear-to-l from-zinc-950 to-transparent z-20 pointer-events-none" />

        {filteredPrototypes.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-sm tracking-widest uppercase">
            No prototypes found in this vibe sector.
          </div>
        ) : (
          /* Infinite Marquee Track: Glides smoothly until hovered, then locks in place for 3D Coverflow interaction */
          <div className="flex gap-4 w-max animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused] py-4 pl-4">
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
                    3D COVERFLOW PHYSICS & CANONICAL CLASSES:
                    - w-85 and md:w-105 replace bracket notation
                    - Negative horizontal margins (-mx-2 md:-mx-4) pull tilted cards together, eliminating visual gaps!
                    - Hovered card pops forward in Z-space with zero rotation and an elevated glowing shadow.
                  */
                  className={`
                    w-85 md:w-105 shrink-0 transition-all duration-500 ease-out cursor-pointer
                    ${isHovered ? 'scale-105 z-30 shadow-[0_25px_60px_rgba(34,211,238,0.2)] transform-[rotateY(0deg)_translateZ(30px)] mx-2 md:mx-4' : ''}
                    ${isLeft ? 'transform-[rotateY(15deg)_scale(0.95)] opacity-75 -mx-2 md:-mx-4' : ''}
                    ${isRight ? 'transform-[rotateY(-15deg)_scale(0.95)] opacity-75 -mx-2 md:-mx-4' : ''}
                    ${hoveredIndex === null ? 'hover:scale-105 opacity-90 hover:opacity-100' : ''}
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
      <div className="mt-6 px-6 py-3 rounded-full bg-zinc-950/90 border border-zinc-800/80 flex flex-wrap justify-center items-center gap-2 md:gap-4 shadow-2xl backdrop-blur-md z-30">
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