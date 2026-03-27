/* src/components/shift-studio/xlg/UnifiedSystemShowcase.tsx */
'use client';
import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { AlertTriangle, CheckCircle2, X, ArrowDown, ArrowRight, Maximize2 } from 'lucide-react';

export default function UnifiedSystemShowcase() {
  const { MATRIX, EVIDENCE } =  WEBSITE_COPY.SHIFT_STUDIO_PAGE;
  
  // State to track which image is currently blown up
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // We map one Matrix Section to exactly ONE unified Evidence Narrative
  const unifiedSections = [
    {
      matrix: MATRIX.SECTIONS[0], // "YOUR DATA"
      evidence: EVIDENCE.MODULES[0] // "Live Data" Narrative (Inventory + Projects)
    },
    {
      matrix: MATRIX.SECTIONS[1], // "YOUR WORKFLOW"
      evidence: EVIDENCE.MODULES[1] // "Unified Workspace" Narrative (Spark AI)
    },
    {
      matrix: MATRIX.SECTIONS[2], // "YOUR MONEY"
      evidence: EVIDENCE.MODULES[2] // "Consolidate Costs" Narrative (Ledger)
    }
  ];

  return (
    <div className="w-full pb-32 relative">
      
      {/* HEADER */}
      <div className="text-center mb-32 relative z-20">
        <h3 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          {MATRIX.TITLE}
        </h3>
        <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed">
          {MATRIX.SUBTITLE}
        </p>
      </div>

      <div className="relative w-full max-w-7xl mx-auto space-y-40">
        {unifiedSections.map((section, idx) => (
          <div key={idx} className="relative w-full">
            
            {/* Section Divider / Title */}
            <div className="flex items-center gap-6 mb-16">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-sm font-mono text-white/50 uppercase tracking-[0.4em] font-bold">
                {section.matrix.TITLE}
              </span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            {/* THE L-SHAPE FLOWCHART GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-8 items-center relative z-10">
              
              {/* === LEFT COLUMN: THE FRICTION === */}
              <div className="lg:col-span-5 flex flex-col items-center">
                 {/* The Problem Box */}
                 <div className="w-full bg-orange-950/10 border border-orange-500/20 rounded-3xl p-8 relative overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
                   <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-orange-500/50 to-transparent" />
                   
                   <h4 className="text-xs font-mono text-orange-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                     <AlertTriangle size={14} /> {MATRIX.HEAD_STANDARD}
                   </h4>
                   
                   <div className="space-y-6">
                     {section.matrix.ROWS.map((row: any, i: number) => (
                       <div key={i} className="relative pl-6 border-l-2 border-orange-500/20">
                          <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-black border-2 border-orange-500/50" />
                          <h5 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                             <X size={16} className="text-orange-500/50" /> {row.feature}
                          </h5>
                          <p className="text-sm text-white/40 font-light leading-relaxed">
                            {row.duct}
                          </p>
                       </div>
                     ))}
                   </div>
                 </div>

                 {/* The Down Arrow */}
                 <div className="py-8 relative">
                   <div className="absolute top-0 bottom-0 w-px bg-linear-to-b from-orange-500/20 via-brand-primary/20 to-brand-primary/50 left-1/2 -translate-x-1/2" />
                   <div className="w-12 h-12 rounded-full bg-black border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(6,182,212,0.3)] relative z-10 animate-bounce">
                     <ArrowDown size={20} />
                   </div>
                 </div>

                 {/* The Solution Narrative */}
                 <div className="w-full pl-6 border-l-2 border-brand-primary/30 relative">
                   <span className="inline-flex items-center gap-2 text-[10px] font-mono text-brand-primary uppercase tracking-widest font-bold mb-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
                     <CheckCircle2 size={14} /> {section.evidence.CAPTION}
                   </span>
                   <h3 className="text-3xl font-black text-white tracking-tight mb-4 leading-tight">{section.evidence.TITLE}</h3>
                   <p className="text-base text-white/60 font-light leading-relaxed">{section.evidence.DESC}</p>
                 </div>
              </div>

              {/* === CENTER CONNECTOR === */}
              <div className="hidden lg:flex lg:col-span-1 justify-center relative mt-auto mb-16">
                 <div className="absolute left-1/2 right-0 h-px bg-brand-primary/20 top-1/2 -translate-y-1/2" />
                 <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.3)] z-10">
                   <ArrowRight size={20} />
                 </div>
              </div>

              {/* === RIGHT COLUMN: THE LIVE SYSTEM IMAGE & FACTS === */}
              <div className="lg:col-span-6 flex flex-col justify-end h-full">
                 
                 <div className="flex lg:hidden justify-center py-4">
                    <ArrowDown size={24} className="text-brand-primary/50 animate-bounce" />
                 </div>

                 <div className="w-full relative group">
                   
                   {/* DYNAMIC LIVE CAPTURE IMAGE CONTAINER */}
                   {section.evidence.IMAGES.length === 1 ? (
                     /* SINGLE IMAGE LAYOUT */
                     <div 
                        className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/20 backdrop-blur-sm transition-all duration-700 group-hover:border-brand-primary/40 group-hover:shadow-[0_20px_60px_rgba(6,182,212,0.15)] mb-6 cursor-pointer"
                        onClick={() => setSelectedImage(section.evidence.IMAGES[0])}
                     >
                       <div className="absolute inset-0 bg-linear-to-tr from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none flex items-center justify-center">
                          <Maximize2 size={32} className="text-white/50 drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-500" />
                       </div>
                       <img 
                         src={section.evidence.IMAGES[0]} 
                         alt={section.evidence.TITLE} 
                         className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700 relative z-0" 
                       />
                     </div>
                   ) : (
                     /* DUAL IMAGE OVERLAPPING STACK */
                     <div className="relative w-full aspect-4/3 sm:aspect-video mb-8">
                       
                       {/* Back Image (Primary) */}
                       <div 
                          className="absolute top-0 left-0 w-[85%] h-[85%] rounded-3xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:-translate-y-2 group-hover:-translate-x-2 z-0 bg-black/40 cursor-pointer"
                          onClick={() => setSelectedImage(section.evidence.IMAGES[0])}
                       >
                         <div className="absolute inset-0 bg-linear-to-tr from-brand-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none flex items-center justify-center">
                            <Maximize2 size={24} className="text-white/50 drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-500" />
                         </div>
                         <img 
                           src={section.evidence.IMAGES[0]} 
                           alt="System View Primary" 
                           className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 transition-opacity duration-700" 
                         />
                       </div>
                       
                       {/* Front Image (Secondary / Floating) */}
                       <div 
                          className="absolute bottom-0 right-0 w-[70%] h-[70%] rounded-3xl overflow-hidden border border-white/20 shadow-[[-20px_-20px_50px_rgba(0,0,0,0.8)]] transition-all duration-700 group-hover:translate-y-2 group-hover:translate-x-2 z-10 bg-black backdrop-blur-md cursor-pointer"
                          onClick={() => setSelectedImage(section.evidence.IMAGES[1])}
                       >
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 pointer-events-none flex items-center justify-center">
                            <Maximize2 size={24} className="text-white/70 drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-500" />
                         </div>
                         <img 
                           src={section.evidence.IMAGES[1]} 
                           alt="System View Secondary" 
                           className="w-full h-full object-cover object-top-left opacity-90 group-hover:opacity-100 transition-opacity duration-700" 
                         />
                       </div>

                     </div>
                   )}

                   {/* Native Bullet Facts */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-primary/5 border border-brand-primary/20 rounded-2xl p-6">
                     {section.evidence.FACTS.map((fact: string, idx: number) => (
                       <div key={idx} className="flex items-center gap-3 text-sm font-medium text-white/80">
                         <div className="w-1.5 h-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(6,182,212,0.8)] shrink-0" />
                         {fact}
                       </div>
                     ))}
                   </div>
                   
                   {/* Background Ambient Glow on Hover */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-primary/10 rounded-full blur-[120px] opacity-0 group-hover:opacity-40 transition-opacity duration-1000 pointer-events-none -z-10" />
                 </div>
              </div>
              
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8 animate-in fade-in zoom-in-95 duration-300"
          onClick={() => setSelectedImage(null)}
        >
          {/* Close Button */}
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 z-101"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X size={24} />
          </button>
          
          {/* The Blown-Up Image */}
          <div 
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="absolute inset-0 bg-brand-primary/20 blur-[150px] -z-10 rounded-full" />
            <img 
              src={selectedImage} 
              alt="Expanded system view" 
              className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,1)] border border-white/10"
            />
          </div>
        </div>
      )}

    </div>
  );
}