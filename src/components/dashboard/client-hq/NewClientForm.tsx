'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// --- NEW IMPORT PATH ---
import { createNewClient } from '@/app/actions/planner';
import { Plus, Loader2, Rocket } from 'lucide-react';

export default function NewClientForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleCreateClient(formData: FormData) {
    setIsSubmitting(true);
    setErrorMsg('');
    
    const response = await createNewClient(formData);
    
    if (response.success) {
      // Instantly teleport the user to the newly created client dashboard!
      router.push(`/dashboard/clients/${response.clientId}`);
    } else {
      setErrorMsg(response.error || 'Failed to create client. They may already exist.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
        <Rocket size={16} className="text-brand-primary" /> Initialize New Client Hub
      </h3>
      
      <form action={handleCreateClient} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center relative z-10">
        <input 
          type="text" 
          name="clientName" 
          placeholder="Enter Company Name (e.g. Collision Correction)" 
          required
          disabled={isSubmitting}
          className="flex-1 w-full bg-bg-surface-200 border border-white/10 rounded-xl px-4 py-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 transition-colors font-mono"
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-brand-primary hover:bg-cyan-400 text-slate-900 font-black px-8 py-4 rounded-xl text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          {isSubmitting ? 'Deploying...' : 'Deploy Hub'}
        </button>
      </form>

      {errorMsg && (
        <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg w-fit relative z-10">
          <p className="text-rose-400 text-[10px] font-mono uppercase tracking-widest">
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
}