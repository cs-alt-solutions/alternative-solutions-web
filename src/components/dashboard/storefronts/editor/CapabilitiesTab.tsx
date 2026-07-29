// src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx
'use client';

import React from 'react';
import { Plus, Trash2, Layers, X } from 'lucide-react';

interface Capability {
  title: string;
  description: string;
  bullets?: string[];
}

export default function CapabilitiesTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  const capabilities: Capability[] = formData.capabilities || [];

  const handleAdd = () => {
    setFormData((prev: any) => ({
      ...prev,
      capabilities: [...(prev.capabilities || []), { title: '', description: '', bullets: [] }]
    }));
  };

  const handleRemove = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      capabilities: (prev.capabilities || []).filter((_: any, i: number) => i !== index)
    }));
  };

  const handleChange = (index: number, field: keyof Capability, value: string) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, capabilities: updated };
    });
  };

  // 🚀 BUG FIXED: Deep cloning the arrays to prevent React state mutation ghosting
  const handleAddBullet = (index: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      const currentBullets = [...(updated[index].bullets || [])];
      updated[index] = { ...updated[index], bullets: [...currentBullets, ''] };
      return { ...prev, capabilities: updated };
    });
  };

  const handleBulletChange = (capIndex: number, bulletIndex: number, value: string) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      const currentBullets = [...(updated[capIndex].bullets || [])];
      currentBullets[bulletIndex] = value;
      updated[capIndex] = { ...updated[capIndex], bullets: currentBullets };
      return { ...prev, capabilities: updated };
    });
  };

  const handleRemoveBullet = (capIndex: number, bulletIndex: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      const currentBullets = [...(updated[capIndex].bullets || [])];
      updated[capIndex] = {
        ...updated[capIndex],
        bullets: currentBullets.filter((_, i) => i !== bulletIndex)
      };
      return { ...prev, capabilities: updated };
    });
  };

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
            <Layers className="w-4 h-4 text-cyan-500" /> Services & Features
          </h3>
        </div>
        <button 
          type="button" 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded transition-colors shadow-sm"
        >
          <Plus className="w-3 h-3" /> Add Item
        </button>
      </div>

      <div className="space-y-6">
        {capabilities.length === 0 ? (
          <div className="text-center p-8 border border-dashed border-zinc-800 bg-zinc-900/30 rounded-xl text-zinc-500 font-mono text-xs uppercase tracking-widest">
            No services defined.
          </div>
        ) : (
          capabilities.map((cap, index) => (
            <div key={index} className="flex flex-col gap-3 p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl relative group shadow-sm">
              
              <div className="flex items-start justify-between gap-4">
                <input 
                  type="text" 
                  placeholder="Service Title (e.g., Shadow Work)" 
                  value={cap.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-white outline-none transition-colors font-bold text-sm"
                />
                <button 
                  type="button" 
                  onClick={() => handleRemove(index)}
                  className="p-2 text-zinc-500 hover:text-red-400 bg-zinc-950 hover:bg-red-500/10 border border-zinc-800 hover:border-red-500/30 rounded-lg transition-colors shrink-0"
                  title="Remove Service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <textarea 
                placeholder="Brief description of this offering..." 
                value={cap.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows={2}
                className="w-full bg-black/40 border border-zinc-800 focus:border-cyan-500 rounded-lg px-3 py-2 text-zinc-300 outline-none transition-colors text-xs resize-none"
              />
              
              {/* BULLET POINT EDITOR */}
              <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3 space-y-2">
                <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center justify-between">
                  <span>Feature Checklist</span>
                  <button 
                    type="button" 
                    onClick={() => handleAddBullet(index)}
                    className="text-cyan-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                  >
                    <Plus size={10} /> Add Bullet
                  </button>
                </div>
                
                {cap.bullets?.map((bullet, bIndex) => (
                  <div key={bIndex} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50 shrink-0" />
                    <input 
                      type="text"
                      placeholder="Detail point..."
                      value={bullet}
                      onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-cyan-500 py-1 text-zinc-300 outline-none transition-colors text-xs"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveBullet(index, bIndex)}
                      className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}