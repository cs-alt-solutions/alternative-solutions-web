import React from 'react';
import { ScanLine } from 'lucide-react';

export default function EdibleComplianceLabel({ item, cleanItemName }: any) {
  return (
    <div className="w-full h-full p-2 sm:p-3 flex flex-col">
      <div className="bg-white border-[3px] border-black rounded-lg flex flex-col text-black font-sans shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] w-[85%] max-w-55 mx-auto flex-1 relative overflow-hidden">
        
        {/* Tamper Seal / Neon Accent */}
        <div className="h-1.5 w-full bg-linear-to-r from-amber-400 via-orange-500 to-rose-500 shrink-0" />

        {/* Scrollable interior so long descriptions never break the card */}
        <div className="p-3 flex flex-col h-full flex-1 overflow-y-auto scrollbar-hide">
          
          {/* HEADER */}
          <div className="border-b-4 border-black pb-1.5 mb-2 shrink-0">
            <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-[7px] font-black uppercase tracking-widest text-zinc-500 mb-0.5">Dosing Facts</p>
                    <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter leading-none wrap-break-word text-black">{cleanItemName}</h2>
                    {item?.brand && <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-0.5">BY {item.brand}</p>}
                </div>
                {item?.iconUrl ? (
                    <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                      <img src={item.iconUrl} className="max-w-full max-h-full object-contain grayscale contrast-200 mix-blend-multiply" alt="Brand" />
                    </div>
                ) : (
                    <ScanLine size={18} className="text-black shrink-0 mt-1" />
                )}
            </div>
          </div>

          {/* HORIZONTAL DATA ROWS WITH SMART LABELS */}
          <div className="flex flex-col shrink-0">
             <div className="flex justify-between items-end border-b-2 border-black pb-1 mb-1 gap-2">
                <span className="text-[8px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap">Amount Per {item?.edibleServingType || 'Serving'}</span>
                <span className="text-[9px] font-black text-right wrap-break-word">{item?.descUses || 'N/A'}</span>
             </div>
             
             <div className="flex justify-between items-end border-b border-black pb-1 mb-1 gap-2">
                <span className="text-[7px] font-bold uppercase tracking-widest shrink-0 whitespace-nowrap">Total {item?.ediblePackageType || 'Package'}</span>
                <span className="text-[8px] font-black text-right wrap-break-word">{item?.descFact || 'N/A'}</span>
             </div>

             {item?.strainType && item.strainType !== 'N/A' && (
               <div className="flex justify-between items-end border-b border-black pb-1 mb-1 pl-2 gap-2">
                  <span className="text-[7px] font-bold tracking-widest shrink-0 whitespace-nowrap">Strain Class</span>
                  <span className="text-[8px] font-black text-right wrap-break-word">{item.strainType}</span>
               </div>
             )}

             {item?.descTaste && (
               <div className="flex justify-between items-end border-b-2 border-black pb-1 mb-1 mt-1 gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap">Flavor Profile</span>
                  <span className="text-[9px] font-black text-right wrap-break-word">{item.descTaste}</span>
               </div>
             )}

             {item?.descFeels && (
               <div className="flex justify-between items-end border-b-4 border-black pb-1 mb-2 mt-1 gap-2">
                  <span className="text-[8px] font-black uppercase tracking-widest shrink-0 whitespace-nowrap">Expected Effect</span>
                  <span className="text-[9px] font-black text-right leading-tight wrap-break-word">{item.descFeels}</span>
               </div>
             )}
          </div>

          {/* DYNAMIC DESCRIPTIONS & DISCLAIMERS */}
          <div className="mt-2 shrink-0 flex flex-col gap-1.5">
              {item?.edibleDetails && item.edibleDetails.length > 0 ? (
                 item.edibleDetails.map((detail: any, index: number) => {
                    if (detail.type === 'disclaimer') {
                       return (
                         <div key={detail.id || index} className="flex items-start gap-1.5 border-t border-black pt-1.5">
                             <div className={`bg-black text-white text-[5px] font-black px-1 py-0.5 uppercase tracking-widest shrink-0 ${index === 0 ? '' : 'mt-1'}`}>
                               {detail.type.toUpperCase()}
                             </div>
                             <p className={`text-[5px] font-bold uppercase tracking-widest text-black leading-tight ${index === 0 ? '' : 'mt-1'}`}>
                               {detail.text}
                             </p>
                         </div>
                       );
                    }
                    return (
                       <div key={detail.id || index} className="bg-zinc-100/50 p-1.5 rounded border border-zinc-200">
                         <div className="text-[6px] text-zinc-800 font-semibold leading-snug whitespace-pre-wrap columns-2 gap-2 text-justify">
                           {detail.text}
                         </div>
                       </div>
                    );
                 })
              ) : (
                 /* FALLBACK FOR LEGACY ITEMS WITHOUT NEW SMART DATA */
                 <>
                    {item?.descBase && (
                       <div className="bg-zinc-100/50 p-1.5 rounded border border-zinc-200">
                         <div className="text-[6px] text-zinc-800 font-semibold leading-snug whitespace-pre-wrap columns-2 gap-2 text-justify">
                           {item.descBase}
                         </div>
                       </div>
                    )}
                    <div className="flex items-start gap-1.5 border-t border-black pt-1.5">
                        <div className="bg-black text-white text-[5px] font-black px-1 py-0.5 uppercase tracking-widest shrink-0">WARNING</div>
                        <p className="text-[5px] font-bold uppercase tracking-widest text-black leading-tight">
                          Consumption of cannabis may impair your ability to drive or operate machinery. Keep away from children.
                        </p>
                    </div>
                 </>
              )}
          </div>

        </div>
      </div>
    </div>
  );
}