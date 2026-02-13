"use client";

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { joinWaitlist } from '@/app/actions';

export default function JoinForm() {
  const { JOIN_PAGE } = WEBSITE_COPY;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    
    // Fire the server action
    const result = await joinWaitlist(email);

    if (result.success) {
      setStatus('success');
      setMessage(result.message);
    } else {
      setStatus('error');
      setMessage(result.message);
      // Let them try again after 3 seconds
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-emerald-400 w-12 h-12" />
        </div>
        <h3 className="text-xl font-bold text-white tracking-widest uppercase">
            {message || JOIN_PAGE.SUCCESS_MSG}
        </h3>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative group">
          <input 
            type="email" 
            placeholder={JOIN_PAGE.INPUT_PLACEHOLDER}
            className="w-full bg-bg-surface-200 border border-white/10 rounded-lg px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-all text-center md:text-left"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
          />
          <div className="absolute inset-0 rounded-lg bg-brand-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="btn-brand w-full flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              {JOIN_PAGE.BTN_SUBMIT} <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {status === 'error' && (
        <div className="flex items-center justify-center gap-2 text-rose-400 text-xs uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={14} />
          {message}
        </div>
      )}
    </div>
  );
}