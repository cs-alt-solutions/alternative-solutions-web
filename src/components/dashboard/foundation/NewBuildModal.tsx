/* src/components/dashboard/foundation/NewBuildModal.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { X, Target, Code, Building2 } from 'lucide-react';

interface NewBuildModalProps {
  onClose: () => void;
  onSuccess: () => void; // Triggered so the parent can refresh the list
}

export default function NewBuildModal({ onClose, onSuccess }: NewBuildModalProps) {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION.NEW_BUILD_MODAL;
  const types = WEBSITE_COPY.DASHBOARD.FOUNDATION.BUILDS.TYPES;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [buildType, setBuildType] = useState<'SAAS' | 'CLIENT'>('SAAS');
  const [clientName, setClientName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('builds')
        .insert([{
          title,
          build_type: buildType,
          client_name: buildType === 'CLIENT' && clientName ? clientName : null,
          target_amount: parseFloat(targetAmount) || 0,
          status: 'ACTIVE'
        }]);

      if (insertError) throw insertError;

      onSuccess(); // Refresh the parent data
      onClose();   // Close the modal
    } catch (err: any) {
      console.error('Insert failed:', err.message);
      setError('System anomaly: Failed to deploy build to the vault.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-bg-surface-100 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/20">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <Target size={20} className="text-brand-primary" />
              {copy.TITLE}
            </h3>
            <p className="text-xs font-mono text-slate-400">{copy.DESC}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">{copy.FIELDS.TITLE}</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-brand-primary/50 transition-colors"
              placeholder="e.g. Project Phoenix"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">{copy.FIELDS.TYPE}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBuildType('SAAS')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                  buildType === 'SAAS' 
                  ? 'bg-brand-primary/10 border-brand-primary/50 text-brand-primary' 
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                <Code size={16} /> <span className="text-xs font-mono uppercase font-bold">{types.SAAS}</span>
              </button>
              <button
                type="button"
                onClick={() => setBuildType('CLIENT')}
                className={`flex items-center justify-center gap-2 py-3 rounded-lg border transition-all ${
                  buildType === 'CLIENT' 
                  ? 'bg-fuchsia-500/10 border-fuchsia-500/50 text-fuchsia-400' 
                  : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/30'
                }`}
              >
                <Building2 size={16} /> <span className="text-xs font-mono uppercase font-bold">{types.CLIENT}</span>
              </button>
            </div>
          </div>

          {buildType === 'CLIENT' && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">{copy.FIELDS.CLIENT_NAME}</label>
              <input 
                type="text" 
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-hidden focus:border-fuchsia-500/50 transition-colors"
                placeholder="e.g. Apex Auto Works"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">{copy.FIELDS.TARGET}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">$</span>
              <input 
                type="number" 
                required
                min="0"
                step="100"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-4 py-3 text-white font-mono focus:outline-hidden focus:border-brand-primary/50 transition-colors"
                placeholder="5000"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {copy.ACTIONS.CANCEL}
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg text-xs font-mono uppercase tracking-widest font-bold bg-white text-black hover:bg-brand-primary transition-colors disabled:opacity-50"
            >
              {isSubmitting ? copy.ACTIONS.SAVING : copy.ACTIONS.SUBMIT}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}