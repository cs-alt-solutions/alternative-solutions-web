import React, { useState } from 'react';
import { Tag, X, Scale, GripVertical, Activity, CloudLightning, Info, ShieldAlert } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

export default function AdminInventoryCategoryManager({ 
  clientConfig, 
  mainCategories, 
  subCategories, setSubCategories, 
  standardTiers, setStandardTiers, 
  setNotification, onClose 
}: any) {
  
  const [isPublishing, setIsPublishing] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{ cat: string, index: number } | null>(null);

  const handlePublishToDatabase = async () => {
    setIsPublishing(true);
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const clientId = clientConfig?.id || 'division';

        const { data, error } = await supabase.from('client_settings').select('payload').eq('client_id', clientId).single();
        const currentPayload = data?.payload || {};
        
        const updatedPayload = { 
            ...currentPayload, 
            subCategories: subCategories,
            pricingTiers: standardTiers 
        };

        const { error: updateError } = await supabase.from('client_settings').update({ 
            payload: updatedPayload,
            updated_at: new Date().toISOString()
        }).eq('client_id', clientId);

        if (updateError) throw updateError;
        setNotification("Category Layout Published to Live Storefront!");
    } catch (err) {
        console.error("Publish Error:", err);
        setNotification("Failed to publish to database.");
    } finally {
        setIsPublishing(false);
    }
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragStart = (e: React.DragEvent, cat: string, index: number) => {
    setDraggedItem({ cat, index });
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnter = (e: React.DragEvent, cat: string, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.cat !== cat) return;
    if (draggedItem.index === targetIndex) return;

    const currentList = [...subCategories[cat]];
    const draggedElement = currentList[draggedItem.index];

    currentList.splice(draggedItem.index, 1);
    currentList.splice(targetIndex, 0, draggedElement);

    setSubCategories({ ...subCategories, [cat]: currentList });
    setDraggedItem({ cat, index: targetIndex });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
  };

  return (
    <div className="p-4 md:p-8 animate-in slide-in-from-right-8 space-y-8 pb-32">
      
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-black text-white uppercase tracking-tight">Database Settings</h2>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">Storefront Taxonomy Map</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
              onClick={handlePublishToDatabase}
              disabled={isPublishing}
              className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50"
           >
              {isPublishing ? <Activity size={16} className="animate-spin" /> : <CloudLightning size={16} />} 
              {isPublishing ? 'Syncing...' : 'Publish to Live'}
           </button>
           <button onClick={onClose} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400 transition-colors shadow-lg active:scale-95"><X size={20}/></button>
        </div>
      </div>

      {/* TAXONOMY REFERENCE GUIDE */}
      <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-3xl p-6 shadow-inner">
         <h3 className="text-sm font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Info size={16} /> Internal Taxonomy Reference Guide
         </h3>
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
               <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Reserve Flower</span>
               <p className="text-xs text-zinc-400 font-medium leading-relaxed">Internally mapped as <strong className="text-zinc-200">Tier 1</strong>. Reserved for highest-end, exotic, and top-shelf exclusive strains.</p>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
               <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Premium Flower</span>
               <p className="text-xs text-zinc-400 font-medium leading-relaxed">Internally mapped as <strong className="text-zinc-200">Tier 2</strong>. The standard classification for high-quality daily-driver strains.</p>
            </div>
            <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
               <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-1">Smoky Steals</span>
               <p className="text-xs text-zinc-400 font-medium leading-relaxed">Internally mapped as <strong className="text-zinc-200">Clearance / Value</strong>. Designated for smalls, popcorn buds, and budget-friendly batches.</p>
            </div>
         </div>
      </div>

      {/* SECTION 1: SUBCATEGORIES (LOCKED) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
           <ShieldAlert size={100} className="text-amber-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-zinc-800/50">
             <div>
               <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                 <Tag size={16} /> Global Subcategories
               </h3>
               <p className="text-xs font-medium text-zinc-500 italic">
                 Drag and drop the pills to set the exact order they will appear on your storefront navigation. <span className="text-amber-500/80 font-bold not-italic ml-1">Addition and removal of categories is locked by Master Admin.</span>
               </p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mainCategories.map((mainCat: string) => {
              const subs = subCategories[mainCat] || [];
              return (
                <div key={mainCat} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-inner">
                  <h3 className="text-[10px] font-black text-emerald-400/80 uppercase tracking-widest mb-4 border-b border-zinc-800/50 pb-2 flex justify-between">
                    {mainCat} <span className="text-zinc-600">{subs.length} Subs</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {subs.map((sub: string, index: number) => (
                      <div 
                        key={sub} 
                        draggable 
                        onDragStart={(e) => handleDragStart(e, mainCat, index)}
                        onDragEnter={(e) => handleDragEnter(e, mainCat, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-bold pl-2 pr-3 py-1.5 rounded-lg flex items-center gap-2 group hover:border-emerald-500/50 transition-all cursor-grab active:cursor-grabbing select-none"
                      >
                        <GripVertical size={12} className="text-zinc-600 group-hover:text-emerald-500/80 shrink-0" />
                        {sub} 
                      </div>
                    ))}
                    {subs.length === 0 && (
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest italic py-1">No subs mapped</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: PRICING TIERS & WEIGHTS (LOCKED) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-20 pointer-events-none">
           <ShieldAlert size={100} className="text-amber-500" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-zinc-800/50">
             <div>
               <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                 <Scale size={16} /> Global Pricing Tiers & Weights
               </h3>
               <p className="text-xs font-medium text-zinc-500 italic">
                 These options appear as pre-fill dropdowns when building pricing tiers in the Product Editor. <span className="text-amber-500/80 font-bold not-italic ml-1">Locked by Master Admin.</span>
               </p>
             </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-inner">
            <div className="flex flex-wrap gap-2">
              {(standardTiers || []).map((tier: string) => (
                <div key={tier} className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 cursor-default select-none">
                  {tier}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}