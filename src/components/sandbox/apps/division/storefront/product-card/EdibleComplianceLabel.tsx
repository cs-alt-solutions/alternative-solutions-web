import React from 'react';
import { ScanLine } from 'lucide-react';

export default function EdibleComplianceLabel({ item, cleanItemName, isSideStacked }: any) {
  const descriptions = item?.edibleDetails?.filter((d: any) => d.type === 'description') || [];
  const disclaimers = item?.edibleDetails?.filter((d: any) => d.type === 'disclaimer') || [];
  const hasInfo = descriptions.length > 0 || item?.descBase;

  return (
    <div className={`flex flex-col text-zinc-100 font-sans h-full w-full relative overflow-hidden ${isSideStacked ? 'bg-zinc-900/80' : 'bg-zinc-900 border-2 border-zinc-700 rounded-lg shadow-lg w-[85%] max-w-64 mx-auto'}`}>
      
      {/* Tamper Seal / Neon Accent */}
      <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-orange-500 to-rose-500 shrink-0" />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6 pb-6 sm:pb-8 flex flex-col h-full flex-1 overflow-hidden">
        
        {/* FIXED HEADER */}
        <div className="border-b-[3px] border-zinc-700/80 pb-2 mb-2 shrink-0">
          <div className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-1">Dosing Facts</p>
                  <h2 className="text-base sm:text-xl font-black uppercase tracking-tighter leading-none wrap-break-word text-zinc-100">{cleanItemName}</h2>
                  {item?.brand && <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-500 mt-1">BY {item.brand}</p>}
              </div>
              {item?.iconUrl ? (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 overflow-hidden">
                    <img src={item.iconUrl} className="max-w-[80%] max-h-[80%] object-contain" alt="Brand" />
                  </div>
              ) : (
                  <ScanLine size={24} className="text-zinc-600 shrink-0 mt-0.5" />
              )}
          </div>
        </div>

        {/* SCROLLABLE MIDDLE (Rows + Descriptions) */}
        <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide pr-2">
           <div className="flex flex-col shrink-0 pb-1">
               <div className="flex justify-between items-end border-b border-zinc-700/80 pb-1 mb-1.5 gap-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap text-zinc-400">Per {item?.edibleServingType || 'Serving'}</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-right wrap-break-word text-zinc-200">{item?.descUses || 'N/A'}</span>
               </div>
               
               <div className="flex justify-between items-end border-b border-zinc-700/80 pb-1 mb-1.5 gap-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest shrink-0 whitespace-nowrap text-zinc-400">Total {item?.ediblePackageType || 'Package'}</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-right wrap-break-word text-zinc-200">{item?.descFact || 'N/A'}</span>
               </div>

               {item?.strainType && item.strainType !== 'N/A' && (
                 <div className="flex justify-between items-end border-b border-zinc-700/80 pb-1 mb-1.5 gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-widest shrink-0 whitespace-nowrap text-zinc-400">Strain Class</span>
                    <span className="text-[9px] sm:text-[10px] font-black text-right wrap-break-word text-indigo-400">{item.strainType}</span>
                 </div>
               )}

               {item?.descTaste && (
                 <div className="flex justify-between items-end border-b border-zinc-700/80 pb-1 mb-1.5 gap-2">
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap text-zinc-400">Flavor</span>
                  <span className="text-[10px] sm:text-[11px] font-black text-right wrap-break-word text-amber-400">{item.descTaste}</span>
                 </div>
               )}

               {item?.descFeels && (
                 <div className="flex justify-between items-end border-b-2 border-zinc-700/80 pb-1 mb-1.5 gap-2">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap text-zinc-400">Effect</span>
                    <span className="text-[10px] sm:text-[11px] font-black text-right leading-tight wrap-break-word text-rose-400">{item.descFeels}</span>
                 </div>
               )}
           </div>

           {/* FDA-Style Solid Text Descriptions */}
           {hasInfo && (
             <div className="shrink-0 flex flex-col pt-1 pb-2">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1.5">INFO:</p>
                {descriptions.length > 0 ? (
                   descriptions.map((detail: any, index: number) => (
                      <div key={detail.id || index} className="border-t border-zinc-700/50 pt-2 mt-2 first:mt-0 first:border-0">
                        <p className="text-[9px] sm:text-[10px] text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">
                          {detail.text}
                        </p>
                      </div>
                   ))
                ) : (
                   item?.descBase && (
                      <div className="border-t border-zinc-700/50 pt-2">
                        <p className="text-[9px] sm:text-[10px] text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">
                          {item.descBase}
                        </p>
                      </div>
                   )
                )}
             </div>
           )}
        </div>

        {/* FIXED FOOTER (Warnings/Disclaimers) */}
        <div className="mt-2 shrink-0 flex flex-col gap-2 pt-2">
           {disclaimers.map((detail: any, index: number) => (
               <div key={detail.id || index} className="flex items-start gap-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                   <div className="bg-rose-500 text-zinc-950 text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest shrink-0 rounded-sm">
                     {detail.type.toUpperCase()}
                   </div>
                   <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-rose-200 leading-snug">
                     {detail.text}
                   </p>
               </div>
           ))}
           <div className="flex items-start gap-2 bg-zinc-800/50 border border-zinc-700/50 p-2 rounded-lg">
               <div className="bg-zinc-700 text-zinc-200 text-[7px] sm:text-[8px] font-black px-1.5 py-0.5 uppercase tracking-widest shrink-0 rounded-sm">WARNING</div>
               <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest text-zinc-400 leading-snug">
                 Consumption of cannabis may impair your ability to drive. Keep away from children.
               </p>
           </div>
        </div>
      </div>
    </div>
  );
}