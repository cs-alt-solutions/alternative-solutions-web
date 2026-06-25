'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
  theme: {
    color: string;
    bg: string;
    border: string;
    glow: string;
  };
}

export default function AutoAccordion({ items }: { items: AccordionItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // The Auto-Cycle Engine
  useEffect(() => {
    if (!isAutoPlaying || items.length === 0) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // Cycles every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, items.length]);

  const handleManualInteraction = (index: number) => {
    setActiveIndex(activeIndex === index ? -1 : index);
    setIsAutoPlaying(false); // Stop the auto-cycle if the user takes control
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const isActive = activeIndex === index;
        const { theme } = item;
        
        return (
          <div 
            key={index} 
            className={`border rounded-2xl overflow-hidden transition-all duration-500 relative ${
              isActive 
                ? `bg-black/80 ${theme.border} ${theme.glow} scale-[1.02] z-10` 
                : 'bg-black/40 border-white/10 hover:border-white/30 hover:bg-white/5 z-0'
            }`}
          >
            <button 
              onClick={() => handleManualInteraction(index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none group/btn"
            >
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl border transition-all duration-500 flex items-center justify-center ${
                  isActive 
                    ? `${theme.bg} ${theme.color} ${theme.border} shadow-inner` 
                    : 'bg-white/5 text-slate-500 border-white/10 group-hover/btn:text-white group-hover/btn:border-white/30'
                }`}>
                  <div className={isActive ? 'animate-pulse' : ''}>
                     {item.icon}
                  </div>
                </div>
                <span className={`text-xl md:text-2xl font-black uppercase tracking-widest transition-colors duration-300 ${
                  isActive ? theme.color : 'text-slate-300 group-hover/btn:text-white'
                }`}>
                  {item.title}
                </span>
              </div>
              <ChevronDown 
                size={24} 
                className={`transition-transform duration-500 ${isActive ? `rotate-180 ${theme.color}` : 'text-slate-600 group-hover/btn:text-white'}`} 
              />
            </button>
            
            <div 
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                isActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 pl-6 md:pl-22 relative">
                <div className={`absolute left-10 md:left-12 top-0 bottom-6 w-0.5 opacity-30 ${theme.bg.replace('/10', '')}`} />
                <p className="text-slate-300 font-light leading-relaxed text-base md:text-lg">
                  {item.desc}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}