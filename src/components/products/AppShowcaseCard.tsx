/* src/components/products/AppShowcaseCard.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Terminal, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface AppShowcaseCardProps {
  title: string;
  status: string;
  description: string;
  linkHref: string;
  linkText?: string;
  uiMockup?: React.ReactNode;
  images?: string[];
}

export default function AppShowcaseCard({
  title,
  status,
  description,
  linkHref,
  linkText = "INITIALIZE APP",
  uiMockup,
  images = []
}: AppShowcaseCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link href={linkHref} className="group block relative bg-black/60 border border-cyan-900/50 hover:border-cyan-400/80 rounded-3xl p-1 overflow-hidden transition-all duration-500 shadow-[0_0_30px_rgba(34,211,238,0.1)] hover:shadow-[0_0_60px_rgba(34,211,238,0.3)] mb-8">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-200 h-200 bg-cyan-500/5 rounded-full blur-[120px] group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
      
      <div className="grid md:grid-cols-12 gap-0 relative z-10 bg-bg-app/80 rounded-[22px] overflow-hidden backdrop-blur-md">
        
        {/* Left: Text & Marketing */}
        <div className="md:col-span-5 p-8 md:p-12 flex flex-col justify-center border-r border-cyan-900/30">
          <div className="inline-flex items-center gap-2 border border-cyan-400/50 bg-cyan-950/50 px-3 py-1.5 rounded-full font-mono text-cyan-400 text-[10px] tracking-widest mb-8 uppercase shadow-[0_0_10px_rgba(34,211,238,0.3)] w-max">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            {status}
          </div>
          
          <h3 className="text-3xl md:text-5xl text-white font-black mb-6 tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
            {title || "UNTITLED PROJECT"}
          </h3>
          
          <p className="text-slate-300 leading-relaxed mb-10 font-light text-sm md:text-base">
            {description || "No description provided."}
          </p>
          
          <div className="flex items-center gap-4 text-cyan-400 font-bold uppercase tracking-widest text-sm group-hover:translate-x-2 transition-transform drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">
            <Terminal size={20} /> {linkText} <span className="text-lg">→</span>
          </div>
        </div>

        {/* Right: The UI Mockup OR Image Carousel */}
        {/* UPDATED: Changed min-h-[300px] to min-h-75 */}
        <div className="md:col-span-7 bg-[#0a0f16] p-4 md:p-12 flex items-center justify-center relative overflow-hidden min-h-75">
          {/* UPDATED: Changed bg-[size:24px_24px] to bg-size-[24px_24px] */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#22d3ee08_1px,transparent_1px),linear-gradient(to_bottom,#22d3ee08_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
          
          {images.length > 0 ? (
            /* IMAGE CAROUSEL */
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-2xl group/carousel">
              <img 
                src={images[currentIdx]} 
                alt={`${title} preview ${currentIdx + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              
              {/* Carousel Controls */}
              {images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-md">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-white flex items-center justify-center hover:bg-brand-primary hover:border-brand-primary opacity-0 group-hover/carousel:opacity-100 transition-all backdrop-blur-md">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === currentIdx ? 'bg-brand-primary w-4 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-white/30'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : uiMockup ? (
            /* FALLBACK MOCKUP */
            uiMockup
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center text-slate-700">
              <ImageIcon size={48} className="mb-4 opacity-50" />
              <p className="font-mono text-xs uppercase tracking-widest">No Media Available</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}