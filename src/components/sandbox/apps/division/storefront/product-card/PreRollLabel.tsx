import React from 'react';
import { ScanLine } from 'lucide-react';

export default function PreRollLabel({ item, cleanItemName, isSideStacked }: any) {
  const isInfused = item?.subCategory?.toLowerCase().includes('infused') || item?.name?.toLowerCase().includes('infused');
  
  const detailsList = item?.smartDetails || item?.edibleDetails || [];
  const descriptions = detailsList.filter((d: any) => d.type === 'description');
  const disclaimers = detailsList.filter((d: any) => d.type === 'disclaimer');
  const hasInfo = descriptions.length > 0 || item?.descBase;

  return (
    <div className="w-full h-full p-2 sm:p-3 flex flex-col">
      {/* Tube Label Aesthetic: Dark bg, thick vertical 'wrap' borders, metallic top line */}
      <div className={`flex flex-col h-full w-full relative overflow-hidden bg-zinc-900 border-x-8 border-zinc-950 shadow-[2px_2px_10px_0px_rgba(0,0,0,0.5)] max-w-55 mx-auto rounded-md`}>
        
        {/* Holographic / Metallic Top Seal */}
        <div className={`h-2 w-full shrink-0 ${isInfused ? 'bg-linear-to-r from-purple-500 via-fuchsia-500 to-pink-500' : 'bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600'}`} />

        <div className="p-3 sm:p-4 flex flex-col h-full flex-1 overflow-y-auto scrollbar-hide text-zinc-200">

          {/* HEADER */}
          <div className="flex flex-col items-center justify-center text-center border-b border-zinc-800/80 pb-3 mb-3 shrink-0">
            <ScanLine size={18} className="text-zinc-600 mb-1.5" />
            <p className="text-[7px] font-black uppercase tracking-widest text-zinc-400 mb-1">
              {isInfused ? 'Infused Pre-Roll' : 'Premium Pre-Roll'}
            </p>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tighter leading-none wrap-break-word text-zinc-100">{cleanItemName}</h2>
            {item?.brand && <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1.5">BY {item.brand}</p>}
          </div>

          {/* 🚀 FIXED: DYNAMIC DESCRIPTIONS (Only using the Block Builder data) */}
          <div className="flex flex-col shrink-0 gap-2">
             {hasInfo && (
               <div className="flex flex-col gap-2">
                  {descriptions.length > 0 ? (
                     descriptions.map((detail: any, index: number) => (
                        <div key={detail.id || index} className="bg-zinc-950/50 p-2.5 rounded-md border border-zinc-800/50 text-center">
                          <p className="text-[8px] sm:text-[9px] text-zinc-300 font-semibold leading-relaxed whitespace-pre-wrap">
                            {detail.text}
                          </p>
                        </div>
                     ))
                  ) : (
                     item?.descBase && (
                        <div className="bg-zinc-950/50 p-2.5 rounded-md border border-zinc-800/50 text-center">
                          <p className="text-[8px] sm:text-[9px] text-zinc-300 font-semibold leading-relaxed whitespace-pre-wrap">
                            {item.descBase}
                          </p>
                        </div>
                     )
                  )}
               </div>
             )}

             {/* DYNAMIC DISCLAIMERS */}
             {disclaimers.length > 0 && (
               <div className="flex flex-col gap-2 mt-2">
                 {disclaimers.map((detail: any, index: number) => (
                     <div key={detail.id || index} className="flex flex-col items-center gap-1 text-center bg-rose-500/10 border border-rose-500/20 p-2 rounded-md">
                         <div className="text-rose-500 text-[6px] font-black uppercase tracking-widest">
                           {detail.type.toUpperCase()}
                         </div>
                         <p className="text-[7px] font-bold uppercase tracking-widest text-rose-200 leading-snug">
                           {detail.text}
                         </p>
                     </div>
                 ))}
               </div>
             )}
          </div>

          {/* SIMULATED BARCODE & FOOTER WARNING */}
          <div className="mt-auto pt-4 shrink-0 flex flex-col items-center opacity-80">
             <div className="flex gap-px h-6 w-full items-end justify-center mb-2.5 overflow-hidden px-4">
               {[...Array(25)].map((_, i) => (
                 <div key={i} className="bg-zinc-600 rounded-t-sm" style={{ width: `${Math.max(1.5, Math.random() * 4)}px`, height: `${Math.max(30, Math.random() * 100)}%` }} />
               ))}
             </div>
             <p className="text-[5px] font-bold uppercase tracking-widest text-zinc-500 text-center leading-tight">
               GOV WARNING: CANNABIS CONTAINS THC. KEEP OUT OF REACH OF CHILDREN.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}