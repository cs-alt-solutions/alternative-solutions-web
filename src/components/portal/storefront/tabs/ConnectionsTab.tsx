import React, { useState } from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Link as LinkIcon, Mail, Trash2 } from 'lucide-react';

export default function ConnectionsTab({ formData, updateForm }: { formData: any, updateForm: any }) {
  const NETWORKS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { id: 'youtube', label: 'YouTube', icon: Youtube },
    { id: 'other', label: 'Other Link', icon: LinkIcon }
  ];

  const handleSocialChange = (network: string, value: string) => {
    updateForm({
      social_handles: { ...formData.social_handles, [network]: value }
    });
  };

  const removeSocial = (network: string) => {
    const updated = { ...formData.social_handles };
    delete updated[network];
    updateForm({ social_handles: updated });
  };

  return (
    <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm space-y-6">
      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2 flex items-center gap-2">
          <Mail size={12}/> Public Contact Email
        </label>
        <input 
          type="email"
          value={formData.contact_email}
          onChange={(e) => updateForm({ contact_email: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
      </div>

      <hr className="border-zinc-800" />

      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">
          Active Social Networks
        </label>
        
        {/* Toggle Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {NETWORKS.map(net => {
            const isActive = formData.social_handles[net.id] !== undefined;
            return (
              <button
                key={net.id}
                type="button"
                onClick={() => !isActive ? handleSocialChange(net.id, '') : removeSocial(net.id)}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                  isActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:border-zinc-600 hover:text-zinc-400'
                }`}
              >
                <net.icon size={20} />
                <span className="text-[9px] font-bold uppercase tracking-wider">{net.label}</span>
              </button>
            )
          })}
        </div>

        {/* Active Inputs */}
        <div className="space-y-3">
          {NETWORKS.filter(n => formData.social_handles[n.id] !== undefined).map(net => (
            <div key={net.id} className="relative flex items-center w-full">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 text-emerald-500/50">
                <net.icon size={16} />
              </div>
              <input 
                type="text"
                value={formData.social_handles[net.id] || ''}
                onChange={(e) => handleSocialChange(net.id, e.target.value)}
                placeholder={net.id === 'other' ? "https://..." : "username"}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-emerald-500/50 rounded-xl text-left pl-12 pr-10 py-3 text-sm text-white outline-none transition-all"
              />
              <button onClick={() => removeSocial(net.id)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-rose-400">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}