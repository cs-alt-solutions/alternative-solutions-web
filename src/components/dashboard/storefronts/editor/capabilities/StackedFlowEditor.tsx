/* src/components/dashboard/storefronts/editor/capabilities/StackedFlowEditor.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Save, Loader2, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontCapabilities } from '@/app/actions/storefronts';
import CategoryAccordion from './CategoryAccordion';

export default function StackedFlowEditor({ formData, setFormData, onReload }: any) {
  const router = useRouter();
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(0);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStorefrontCapabilities(formData.id, localCaps);
      setFormData((prev: any) => ({ ...prev, capabilities: localCaps }));
      router.refresh();
      if (onReload) onReload();
    } catch (err) { 
      alert("Failed to save service data."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl">
        <div>
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Briefcase size={14} /> Service Matrix Engine
          </h3>
          <p className="text-[10px] font-mono text-cyan-500/70 uppercase mt-1">Optimized for standard business services & features.</p>
        </div>
        <button onClick={addCapability} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-cyan-500 text-zinc-950 px-4 py-2 rounded-lg hover:bg-cyan-400 transition-colors shadow-md">
          <Plus className="w-3 h-3" /> Add Service
        </button>
      </div>

      <div className="space-y-4">
        {localCaps.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30">
            <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">No services defined.</p>
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
              isMenuMode={false} // Explicitly forces Service Card rendering
            />
          ))
        )}
      </div>

      <button 
        onClick={handleSave} 
        disabled={isSaving} 
        className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black tracking-widest text-[10px] uppercase py-3.5 rounded-lg transition-all shadow-[0_0_15px_rgba(8,145,178,0.2)] disabled:opacity-50 mt-4 cursor-pointer"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
        {isSaving ? 'SYNCING SERVICES...' : 'SAVE SERVICE MATRIX'}
      </button>
    </div>
  );
}