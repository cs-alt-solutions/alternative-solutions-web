// src/components/dashboard/storefronts/editor/core/CustomHeadings.tsx
import React from 'react';
import { Heading } from 'lucide-react';

export default function CustomHeadings({ formData, handleChange }: { formData: any, handleChange: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-indigo-400 mb-2">
        <Heading size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Custom Section Titles</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Services Heading</label>
          <input name="capabilities_heading" value={formData.capabilities_heading || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-indigo-500 outline-none transition-all text-sm" placeholder="e.g. Services" />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Gallery Heading</label>
          <input name="gallery_heading" value={formData.gallery_heading || ''} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white focus:border-indigo-500 outline-none transition-all text-sm" placeholder="e.g. Gallery" />
        </div>
      </div>
    </div>
  );
}