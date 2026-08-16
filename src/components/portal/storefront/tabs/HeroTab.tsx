import React from 'react';

export default function HeroTab({ formData, updateForm }: { formData: any, updateForm: any }) {
  return (
    <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-4">
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Primary Hook (H1)</label>
        <input 
          value={formData.tagline}
          onChange={(e) => updateForm({ tagline: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
        />
      </div>
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Supporting Subtext</label>
        <textarea 
          value={formData.subtext}
          onChange={(e) => updateForm({ subtext: e.target.value })}
          rows={4}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
        />
      </div>
    </div>
  );
}