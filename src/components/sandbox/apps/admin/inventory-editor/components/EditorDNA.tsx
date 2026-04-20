import React from 'react';
import { BookText, Wind, Cookie, Droplet, Sparkles, Activity } from 'lucide-react';

export default function EditorDNA({
  updatedItem, setUpdatedItem, descMode, setDescMode, showDNA, showLineage, isEdible
}: any) {
  return (
    <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
       <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
         <BookText size={16} className="text-emerald-400" /> {showDNA ? (isEdible ? 'Product Facts & Dosing' : 'Product DNA & Description') : 'Product Description'}
       </h2>
       
       {isEdible ? (
         <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-zinc-950/50 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] rounded-2xl p-5">
               <div className="flex items-center gap-2 mb-5 border-b border-zinc-800/80 pb-3">
                  <Activity size={16} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Edibles Compliance Data</span>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Total Package Amount</label>
                     <input 
                       type="text" 
                       value={updatedItem.descFact} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descFact: e.target.value})} 
                       placeholder="e.g. 200mg Total THC" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Per Serving Amount</label>
                     <input 
                       type="text" 
                       value={updatedItem.descUses} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descUses: e.target.value})} 
                       placeholder="e.g. 10mg per piece" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Flavor Profile</label>
                     <input 
                       type="text" 
                       value={updatedItem.descTaste} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descTaste: e.target.value})} 
                       placeholder="e.g. Sour Watermelon" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Expected Effect</label>
                     <input 
                       type="text" 
                       value={updatedItem.descFeels} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descFeels: e.target.value})} 
                       placeholder="e.g. Heavy couch-lock" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
               </div>
            </div>
            
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5">
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">General Description / Disclaimer</label>
               <textarea 
                 value={updatedItem.descBase} 
                 onChange={(e) => setUpdatedItem({...updatedItem, descBase: e.target.value})} 
                 rows={3} 
                 placeholder="Add any extra product details..." 
                 className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-300 focus:border-emerald-500/50 outline-none transition-colors resize-none" 
               />
            </div>
         </div>
       ) : (
         <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  Storytelling Format
                </label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <button 
                    onClick={(e) => { e.preventDefault(); setDescMode('desc'); }}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors ${descMode === 'desc' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Standard Description
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setDescMode('fact'); }}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${descMode === 'fact' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-sm' : 'text-zinc-500 hover:text-pink-400/50'}`}
                  >
                    <Sparkles size={10} /> Insider Fact
                  </button>
                </div>
              </div>
              
              {descMode === 'desc' ? (
                <textarea 
                  value={updatedItem.descBase} 
                  onChange={(e) => setUpdatedItem({ ...updatedItem, descBase: e.target.value })} 
                  rows={3} 
                  placeholder="Write a traditional product description..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-300 focus:border-emerald-500/50 outline-none transition-colors resize-none" 
                />
              ) : (
                <textarea 
                  value={updatedItem.descFact} 
                  onChange={(e) => setUpdatedItem({ ...updatedItem, descFact: e.target.value })} 
                  rows={3} 
                  placeholder="Write a short, punchy insider fact..."
                  className="w-full bg-zinc-900 border border-pink-500/30 rounded-xl p-3.5 text-sm font-medium text-pink-100 focus:border-pink-500 outline-none transition-colors resize-none" 
                />
              )}
            </div>
            
            {showDNA && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="relative">
                    <Wind size={14} className="absolute left-3 top-10 text-cyan-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Feels</label>
                    <input type="text" value={updatedItem.descFeels} onChange={(e) => setUpdatedItem({ ...updatedItem, descFeels: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                  <div className="relative">
                    <Cookie size={14} className="absolute left-3 top-10 text-amber-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Taste</label>
                    <input type="text" value={updatedItem.descTaste} onChange={(e) => setUpdatedItem({ ...updatedItem, descTaste: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                  <div className="relative">
                    <Droplet size={14} className="absolute left-3 top-10 text-emerald-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Uses</label>
                    <input type="text" value={updatedItem.descUses} onChange={(e) => setUpdatedItem({ ...updatedItem, descUses: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                </div>
            )}

            {showLineage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl mt-2">
                 <div>
                   <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Lineage / Cross / Strain Detail</label>
                   <input type="text" value={updatedItem.lineage} onChange={(e) => setUpdatedItem({ ...updatedItem, lineage: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" placeholder="e.g. Gelato × Zkittlez" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Genetics Type</label>
                   <select value={updatedItem.strainType} onChange={(e) => setUpdatedItem({ ...updatedItem, strainType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none">
                     {['Sativa', 'Indica', 'Hybrid', 'Sativa Dom Hybrid', 'Indica Dom Hybrid', 'CBD', 'N/A'].map((st:string)=><option key={st} value={st}>{st}</option>)}
                   </select>
                 </div>
              </div>
            )}
         </div>
       )}
    </section>
  );
}