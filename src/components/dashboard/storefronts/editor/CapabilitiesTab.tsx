/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Loader2, Briefcase, Utensils } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontCapabilities } from '@/app/actions/storefronts';
import CategoryAccordion from './capabilities/CategoryAccordion';

export default function CapabilitiesTab({ 
  formData, 
  setFormData, 
  onReload 
}: { 
  formData: any; 
  setFormData: any; 
  onReload?: () => void; 
}) {
  const router = useRouter();
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);
  const [isSaving, setIsSaving] = useState(false);

  const isMenuMode = formData?.content_layout === 'menu';
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
    const updated = [...localCaps, { title: '', description: '', price: '', bullets: [], isAlaCarte: false }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(updated.length - 1);
  };

  const addAddon = () => {
    const updated = [...localCaps, { title: '', description: '', price: '', bullets: [], isAlaCarte: true }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(updated.length - 1);
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      <div className={`flex items-center justify-between border-b border-zinc-800 pb-4 ${isMenuMode ? 'text-fuchsia-500' : 'text-cyan-500'}`}>
        <div className="flex items-center gap-2">
          {isMenuMode ? <Utensils className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            {isMenuMode ? 'Culinary Menu Flow' : 'Service Matrix Engine'}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          {isCreativeMode ? (
            <>
              <button 
                type="button" 
                onClick={addPackage} 
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" /> Package
              </button>
              <button 
                type="button" 
                onClick={addAddon} 
                className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm"
              >
                <Plus className="w-3 h-3" /> Add-on
              </button>
            </>
          ) : (
            <button 
              type="button" 
              onClick={addPackage} 
              className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer px-3 py-1.5 rounded-lg shadow-sm border ${isMenuMode ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20 hover:bg-fuchsia-500/20' : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/20 hover:bg-cyan-500/20'}`}
            >
              <Plus className="w-3 h-3" /> {isMenuMode ? 'Add Category' : 'Add Service'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {localCaps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
              {isMenuMode ? 'No menu categories defined.' : 'No services defined.'}
            </p>
          </div>
        ) : (
          localCaps.map((cap, index) => (
            <CategoryAccordion 
              key={index}
              cap={cap}
              index={index}
              isOpen={openCapIndex === index}
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