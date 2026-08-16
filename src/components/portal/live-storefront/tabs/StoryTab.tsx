import React from 'react';

export default function StoryTab({ formData, updateForm }: { formData: any, updateForm: any }) {
  return (
    <div className="bg-black/40 border border-fuchsia-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">About Bio</label>
      <textarea 
        value={formData.about_bio}
        onChange={(e) => updateForm({ about_bio: e.target.value })}
        rows={8}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none"
      />
    </div>
  );
}