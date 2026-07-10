// src/components/dashboard/storefronts/editor/core/BrandIdentity.tsx
import React from 'react';
import { Store, Link as LinkIcon, Mail, MonitorPlay } from 'lucide-react';

export default function BrandIdentity({ formData, handleChange, setFormData }: { formData: any, handleChange: any, setFormData: any }) {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6 shadow-xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-3 text-cyan-400">
          <Store size={18} />
          <h3 className="text-xs font-black uppercase tracking-[0.2em]">Brand Identity</h3>
        </div>
        
        {/* THE NEW PROTOTYPE TOGGLE */}
        <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-lg w-fit">
          <label className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest cursor-pointer flex items-center gap-2">
            <MonitorPlay size={12} className={formData.is_template ? "text-fuchsia-400" : "text-zinc-600"} />
            Display as Public Prototype
          </label>
          <button 
            type="button"
            onClick={() => setFormData((prev: any) => ({ ...prev, is_template: !prev.is_template }))}
            className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${formData.is_template ? 'bg-fuchsia-500' : 'bg-zinc-700'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${formData.is_template ? 'left-5.5' : 'left-0.5'}`} />
          </button>
        </div>
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