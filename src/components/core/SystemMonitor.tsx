/* src/components/core/SystemMonitor.tsx */
import React from 'react';

interface SystemMonitorProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
}

export default function SystemMonitor({ src, alt, caption, priority = false }: SystemMonitorProps) {
  return (
    <div className={`relative group ${priority ? 'w-full max-w-6xl mx-auto' : 'w-full'}`}>
      
      {/* THE AMBIENT LED BACKGLOW */}
      <div className="absolute -inset-2 md:-inset-4 bg-brand-primary/20 rounded-[2rem] blur-2xl opacity-40 group-hover:opacity-80 group-hover:bg-brand-primary/30 transition-all duration-700 pointer-events-none" />
      
      {/* THE GLASS INTERFACE */}
      <div className="relative rounded-2xl border border-white/5 bg-white/2 p-2 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500 group-hover:border-brand-primary/30">
        
        {/* Floating Industrial Label */}
        {caption && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
            <span className="px-3 py-1.5 rounded bg-black/80 border border-white/10 text-[10px] font-mono text-white/60 uppercase tracking-widest backdrop-blur-md group-hover:border-brand-primary/50 group-hover:text-brand-primary transition-colors shadow-lg">
              {caption}
            </span>
          </div>
        )}
        
        {/* Clean Image Container */}
        <div className="relative rounded-xl overflow-hidden border border-white/5 bg-bg-app shadow-inner">
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          />
        </div>
      </div>
      
    </div>
  );
}