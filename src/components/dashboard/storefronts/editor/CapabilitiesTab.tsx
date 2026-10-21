/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Utensils, Trash2, Save, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontCapabilities } from '@/app/actions/storefronts';
import CategoryAccordion from './capabilities/CategoryAccordion';

export default function CapabilitiesTab({ formData, setFormData, onReload }: { formData: any; setFormData: any; onReload?: () => void; }) {
  const router = useRouter();
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);
  const [isSaving, setIsSaving] = useState(false);

  // THE FIX: Trigger off the Industry Tag, not the layout constraint!
  const isMenuMode = formData?.industry_tag === 'Culinary';
  const isCreativeMode = formData?.industry_tag === 'Creative';

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) => 
        typeof c === 'string' ? { title: c, description: '', price: '', bullets: [], isAlaCarte: false } : { ...c, bullets: c.bullets || [] }
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const addPackage = () => {
    const updated = [{ 
      title: '', 
      description: '', 
      price: isMenuMode ? 'All Day' : '', 
      bullets: [], 
      isAlaCarte: false 
    }, ...localCaps];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(0); // Opens the newly created package accordion
  };

  const addAddon = () => {
    // Add-ons drop to the bottom of the local array so they don't interrupt packages
    const updated = [...localCaps, { 
      title: '', 
      description: '', 
      price: isMenuMode ? 'All Day' : '', 
      bullets: [], 
      isAlaCarte: true 
    }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const updated = [...localCaps];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCapability = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStorefrontCapabilities(formData.id, localCaps);
      setFormData((prev: any) => ({ ...prev, capabilities: localCaps }));
      router.refresh();
      if (onReload) onReload();
    } catch (err) {
      alert("Failed to save architecture.");
    } finally {
      setIsSaving(false);
    }
  };

  // Separate the data for rendering
  const packages = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => !c.isAlaCarte);
  const addons = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.isAlaCarte);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      {/* 1. CORE PACKAGES SECTION */}
      <div>
        <div className={`flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 ${isMenuMode ? 'text-fuchsia-500' : 'text-cyan-500'}`}>
          <div className="flex items-center gap-2">
            {isMenuMode ? <Utensils className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              {isMenuMode ? 'Culinary Menu Categories' : 'Core Packages'}
            </h2>
          </div>
          
          <button 
            type="button" 
            onClick={addPackage} 
            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer px-3 py-1.5 rounded-lg shadow-sm border ${isMenuMode ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20 hover:bg-fuchsia-500/20' : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20'}`}
          >
            <Plus className="w-3 h-3" /> {isMenuMode ? 'Add Category' : 'Add Package'}
          </button>
        </div>

        <div className="space-y-4">
          {packages.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No core packages defined.</p>
            </div>
          ) : (
            packages.map((cap) => (
              <CategoryAccordion 
                key={cap.originalIndex}
                cap={cap}
                index={cap.originalIndex}
                isOpen={openCapIndex === cap.originalIndex}
                setOpenCapIndex={setOpenCapIndex}
                localCaps={localCaps}
                setLocalCaps={setLocalCaps}
                formData={formData}
                setFormData={setFormData}
                onReload={onReload}
              />
            ))
          )}
        </div>
      </div>

      {/* 2. FLAT ADD-ONS SECTION (No Accordions) */}
      <div className="pt-6 border-t border-zinc-800/50">
        <div className="flex items-center justify-between pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-fuchsia-500" />
            <h2 className="text-sm font-black text-white uppercase tracking-widest">Flexible Upgrades (Add-ons)</h2>
          </div>
          <button 
            type="button" 
            onClick={addAddon} 
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-3 h-3" /> Add-on
          </button>
        </div>

        <div className="space-y-3">
          {addons.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">No quick add-ons defined.</p>
            </div>
          ) : (
            addons.map((addon) => (
              <div key={addon.originalIndex} className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-xl flex flex-col gap-3 group relative">
                <button 
                  onClick={() => removeCapability(addon.originalIndex)}
                  className="absolute top-4 right-4 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Remove Add-on"
                >
                  <Trash2 size={14} />
                </button>
                
                <div className="flex items-start gap-3 pr-8">
                  <div className="flex-1">
                    <input 
                      value={addon.title} 
                      onChange={(e) => handleUpdateAddon(addon.originalIndex, 'title', e.target.value)}
                      placeholder="Add-on Name (e.g., Drone Footage)" 
                      className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-white text-xs focus:border-fuchsia-500 outline-none"
                    />
                  </div>
                  <div className="w-24 shrink-0">
                    <input 
                      value={addon.price} 
                      onChange={(e) => handleUpdateAddon(addon.originalIndex, 'price', e.target.value)}
                      placeholder="$150" 
                      className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-fuchsia-400 font-mono font-bold text-xs focus:border-fuchsia-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <input 
                    value={addon.description} 
                    onChange={(e) => handleUpdateAddon(addon.originalIndex, 'description', e.target.value)}
                    placeholder="Short description (optional)" 
                    className="w-full bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 text-zinc-300 text-[11px] focus:border-fuchsia-500 outline-none"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <button 
        type="button"
        onClick={handleSave} 
        disabled={isSaving} 
        className={`w-full flex items-center justify-center gap-2 text-white font-black tracking-widest text-[10px] uppercase py-3.5 rounded-lg transition-all disabled:opacity-50 mt-4 cursor-pointer ${
          isMenuMode ? 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(192,38,211,0.2)]' : 'bg-cyan-600 hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.2)]'
        }`}
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
        {isSaving ? 'SYNCING ARCHITECTURE...' : 'SAVE ARCHITECTURE'}
      </button>

    </div>
  );
}