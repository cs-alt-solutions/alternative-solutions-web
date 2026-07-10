// src/components/dashboard/storefronts/editor/core/BrandIdentity.tsx
import React from 'react';
import { Store, Link as LinkIcon, Mail } from 'lucide-react';

export default function BrandIdentity({ formData, handleChange }: { formData: any, handleChange: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      <div className="flex items-center gap-3 text-cyan-400 mb-2">
        <Store size={18} />
        <h3 className="text-xs font-black uppercase tracking-[0.2em]">Brand Identity</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Business Name</label>
          <input name="business_name" value={formData.business_name} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><LinkIcon size={10} /> Routing Slug</label>
          <input name="slug" value={formData.slug} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-cyan-400 font-mono text-sm outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> Public Email</label>
          <input name="contact_email" value={formData.contact_email} onChange={handleChange} className="w-full bg-black/40 p-3 rounded-xl border border-white/5 text-white text-sm outline-none focus:border-cyan-500 transition-colors" placeholder="hello@example.com" />
        </div>
      </div>
    </div>
  );
}