// src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical, Save, Loader2, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontCapabilities } from '@/app/actions/storefronts';

// THE FIX: Added onReload to the parameters and the TypeScript interface
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) => 
        typeof c === 'string' ? { title: c, description: '' } : c
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const addCapability = () => setLocalCaps([...localCaps, { title: '', description: '' }]);

  const updateCap = (index: number, field: string, value: string) => {
    const updated = [...localCaps];
    updated[index][field] = value;
    setLocalCaps(updated);
  };

  const removeCap = (index: number) => {
    setLocalCaps(localCaps.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...localCaps];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setLocalCaps(updated);
  };

  const moveDown = (index: number) => {
    if (index === localCaps.length - 1) return;
    const updated = [...localCaps];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setLocalCaps(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateStorefrontCapabilities(formData.id, localCaps);
      setFormData((prev: any) => ({ ...prev, capabilities: localCaps }));
      router.refresh();
      
      // THE FIX: Fire the canvas reload so the iframe instantly updates
      if (onReload) onReload();
    } catch (err) {
      alert("Failed to save services.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-fuchsia-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Service Matrix</h2>
        </div>
        <button onClick={addCapability} className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 transition-colors">
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
            <div key={index} className="flex gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl group relative shadow-sm">
              <div className="flex flex-col gap-1 items-center justify-center shrink-0 w-6 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                <button type="button" onClick={() => moveUp(index)} disabled={index === 0} className="hover:text-cyan-400 disabled:opacity-0"><GripVertical className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  value={cap.title} 
                  onChange={(e) => updateCap(index, 'title', e.target.value)} 
                  placeholder="Service Name (e.g., Commercial Photography)" 
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white font-bold outline-none focus:border-fuchsia-500 transition-colors"
                />
                <textarea 
                  value={cap.description} 
                  onChange={(e) => updateCap(index, 'description', e.target.value)} 
                  placeholder="Short description of this capability..." 
                  rows={2}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-300 outline-none focus:border-fuchsia-500 transition-colors resize-none"
                />
              </div>
              <button onClick={() => removeCap(index)} className="shrink-0 p-2 text-zinc-600 hover:text-red-400 transition-colors self-start">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <button 
        onClick={handleSave} 
        disabled={isSaving} 
        className="w-full flex items-center justify-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black tracking-widest text-[10px] uppercase py-3 rounded-lg transition-all shadow-[0_0_10px_rgba(192,38,211,0.2)] disabled:opacity-50 mt-4"
      >
        {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} 
        {isSaving ? 'SYNCING MATRIX...' : 'SAVE SERVICES LIST'}
      </button>

    </div>
  );
}