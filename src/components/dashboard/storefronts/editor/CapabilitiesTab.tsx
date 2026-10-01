/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layers } from 'lucide-react';
import CategoryAccordion from './capabilities/CategoryAccordion';

export default function CapabilitiesTab({ 
  formData, setFormData, onReload
}: { formData: any; setFormData: any; onReload?: () => void; }) {
  
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);
  const isMenuMode = formData?.content_layout === 'menu';

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) => 
        typeof c === 'string' ? { title: c, description: '', bullets: [] } : { ...c, bullets: c.bullets || [] }
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const addCapability = () => {
    const updated = [...localCaps, { title: '', description: '', bullets: [] }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setOpenCapIndex(updated.length - 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-fuchsia-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">
            {isMenuMode ? 'Menu Architecture' : 'Service Matrix'}
          </h2>
        </div>
        <button onClick={addCapability} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
          <Plus className="w-3 h-3" /> {isMenuMode ? 'Add Category' : 'Add Service'}
        </button>
      </div>

      <div className="space-y-4">
        {localCaps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No categories defined.</p>
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
    </div>
  );
}