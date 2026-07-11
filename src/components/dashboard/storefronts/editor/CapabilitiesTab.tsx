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
  
  // Connect to the master state
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

  // 🚨 BULLET POINT LOGIC
  const handleAddBullet = (index: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      if (!updated[index].bullets) updated[index].bullets = [];
      updated[index].bullets.push('');
      return { ...prev, capabilities: updated };
    });
  };

  const handleBulletChange = (capIndex: number, bulletIndex: number, value: string) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      if (updated[capIndex].bullets) {
        updated[capIndex].bullets[bulletIndex] = value;
      }
      return { ...prev, capabilities: updated };
    });
  };

  const handleRemoveBullet = (capIndex: number, bulletIndex: number) => {
    setFormData((prev: any) => {
      const updated = [...(prev.capabilities || [])];
      if (updated[capIndex].bullets) {
        updated[capIndex].bullets.splice(bulletIndex, 1);
      }
      return { ...prev, capabilities: updated };
    });
  };

  return (
    <div className="space-y-8 max-w-4xl pb-10 pt-6">
      
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-500" /> Services & Features
          </h3>
          <p className="text-zinc-500 text-sm mt-1">Define core offerings and feature checklists.</p>
        </div>
        <button 
          type="button" 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-4">
        {capabilities.length === 0 ? (
          <div className="text-center p-12 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-600 font-mono text-sm">
            No items defined yet. Click "Add Item" to start building.
          </div>
        ) : (
          capabilities.map((cap, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative group">
              <div className="flex-1 space-y-4">
                <input 
                  type="text" 
                  placeholder="Title (e.g., Weekly Meal Prep)" 
                  value={cap.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full bg-transparent border-b border-zinc-800 focus:border-cyan-500 px-2 py-2 text-white outline-none transition-colors font-bold"
                />
                <textarea 
                  placeholder="Description (Optional) - A brief intro to the service." 
                  value={cap.description}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-500 rounded px-3 py-2 text-zinc-300 outline-none transition-colors text-sm resize-none"
                />
                
                {/* 🚨 BULLET POINT EDITOR */}
                <div className="pl-3 border-l-2 border-zinc-800 space-y-2 mt-4">
                  {cap.bullets?.map((bullet, bIndex) => (
                    <div key={bIndex} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                      <input 
                        type="text"
                        placeholder="e.g., Plan your menu based on preferences..."
                        value={bullet}
                        onChange={(e) => handleBulletChange(index, bIndex, e.target.value)}
                        className="w-full bg-transparent border-b border-zinc-800/50 focus:border-cyan-500 py-1.5 text-zinc-300 outline-none transition-colors text-sm"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveBullet(index, bIndex)}
                        className="text-zinc-600 hover:text-red-500 transition-colors p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => handleAddBullet(index)}
                    className="text-[10px] font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 flex items-center gap-1 pt-2 transition-colors"
                  >
                    <Plus size={12} /> Add Bullet Point
                  </button>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => handleRemove(index)}
                className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors mt-2"
                title="Remove Item"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}