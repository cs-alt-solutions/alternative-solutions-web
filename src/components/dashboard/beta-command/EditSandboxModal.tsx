/* src/components/dashboard/beta-command/EditSandboxModal.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Edit2, X } from 'lucide-react';

interface EditSandboxModalProps {
  client: any;
  onClose: () => void;
  onSave: (updatedClient: any) => void;
}

export default function EditSandboxModal({ client, onClose, onSave }: EditSandboxModalProps) {
  const [formData, setFormData] = useState({ ...client });
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND.SANDBOXES.EDIT_MODAL;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3 text-cyan-400">
            <Edit2 size={20} className="drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <h2 className="font-black text-lg text-white uppercase tracking-widest">{copy.TITLE}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 rounded-full">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{copy.AGENCY_NAME}</label>
              <input type="text" value={formData.agencyName} onChange={(e) => setFormData({...formData, agencyName: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{copy.APP_TITLE}</label>
              <input type="text" value={formData.appTitle} onChange={(e) => setFormData({...formData, appTitle: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{copy.ACCESS_CODE}</label>
              <input type="text" value={formData.accessCode} onChange={(e) => setFormData({...formData, accessCode: e.target.value.toUpperCase()})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-cyan-400 focus:outline-none focus:border-cyan-500/50 transition-colors uppercase tracking-widest" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{copy.MASTER_PIN}</label>
              <input type="text" value={formData.security.pin} onChange={(e) => setFormData({...formData, security: { ...formData.security, pin: e.target.value }})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-black text-amber-400 focus:outline-none focus:border-cyan-500/50 transition-colors tracking-widest" maxLength={4} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">{copy.PRIMARY_CONTACT}</label>
            <input type="text" value={formData.primaryContact} onChange={(e) => setFormData({...formData, primaryContact: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-white/5 mt-6">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl font-bold text-xs text-zinc-400 bg-zinc-800 hover:bg-zinc-700 transition-colors uppercase tracking-widest">
              {copy.BTN_CANCEL}
            </button>
            <button type="submit" className="flex-1 py-3 rounded-xl font-black text-xs text-zinc-950 bg-cyan-500 hover:bg-cyan-400 transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              {copy.BTN_SAVE}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}