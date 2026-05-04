'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewClient } from '@/app/actions';
import { Plus, Loader2 } from 'lucide-react';

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
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
        Provision New Client HQ
      </h3>
      <form action={handleCreateClient} className="flex gap-2 items-center">
        <input 
          type="text" 
          name="clientName" 
          placeholder="Client Name (e.g. Luckystrike)" 
          required
          disabled={isSubmitting}
          className="flex-1 bg-bg-surface-200 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-primary/50 transition-colors font-mono"
        />
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-brand-primary hover:bg-brand-primary/90 text-black font-bold px-6 py-3 rounded-xl text-sm uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          Provision
        </button>
      </form>
      {errorMsg && (
        <p className="text-red-400 text-xs mt-3 font-mono uppercase">{errorMsg}</p>
      )}
    </div>
  );
}