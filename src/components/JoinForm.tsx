/* src/components/JoinForm.tsx */
'use client';

import React, { useRef, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { joinWaitlist } from '@/app/actions';
import { ArrowRight, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

export default function JoinForm({ source }: { source: 'Shift Studio' | 'Restricted Access' }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    setStatus('loading');
    setErrorMessage('');
    const res = await joinWaitlist(formData);
    if (res?.success) {
      setStatus('success');
      formRef.current?.reset();
    } else {
      setStatus('error');
      setErrorMessage(res?.error || 'Failed to submit application.');
    }
  }

  // --- SUCCESS STATE ---
  if (status === 'success') {
    const successMsg = source === 'Restricted Access' 
      ? WEBSITE_COPY.ACCESS_HOOK.SUCCESS_MSG 
      : WEBSITE_COPY.JOIN_PAGE.SUCCESS_MSG;

    return (
      <div className="flex flex-col items-center justify-center gap-4 text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-8 py-8 rounded-xl w-full mx-auto animate-in fade-in zoom-in duration-500 text-center">
        <CheckCircle2 size={32} />
        <span className="text-xs font-bold uppercase tracking-widest leading-relaxed max-w-sm">
          {successMsg}
        </span>
      </div>
    );
  }

  // --- ERROR BANNER ---
  const ErrorBanner = () => status === 'error' ? (
    <div className="flex items-center gap-3 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg text-[10px] font-mono mb-4 animate-in fade-in duration-300">
      <AlertTriangle size={14} className="shrink-0" />
      <span className="uppercase tracking-widest">{errorMessage}</span>
    </div>
  ) : null;

  // --- THE COMMUNITY GATEKEEPER ---
  if (source === 'Restricted Access') {
    const copy = WEBSITE_COPY.ACCESS_HOOK;
    const fields = copy.FIELDS;
    
    return (
      <form ref={formRef} action={action} className="flex flex-col gap-5 w-full text-left animate-in fade-in duration-500">
        <input type="hidden" name="source" value={source} />
        
        <ErrorBanner />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{fields.NAME}</label>
            <input type="text" name="name" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
          </div>
          <div className="space-y-1.5">
             <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{fields.EMAIL}</label>
             <input type="email" name="email" required className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
          </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-[10px] font-mono text-text-muted uppercase tracking-widest pl-2">{fields.PHONE}</label>
           <input type="tel" name="phone" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white" />
        </div>

        <div className="flex items-start gap-3 px-2 py-2">
           <div className="flex items-center h-5">
             <input 
               type="checkbox" 
               name="sms_consent" 
               id="sms_consent" 
               className="w-4 h-4 rounded border-white/10 bg-black/50 text-brand-primary focus:ring-brand-primary focus:ring-offset-black cursor-pointer" 
             />
           </div>
           <label htmlFor="sms_consent" className="text-xs text-text-muted leading-tight cursor-pointer select-none">
             {fields.SMS_CONSENT}
           </label>
        </div>
        
        <button type="submit" disabled={status === 'loading'} className="btn-brand flex items-center justify-center gap-3 py-4 rounded-lg w-full disabled:opacity-50 mt-2">
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <>{copy.BTN_SUBMIT} <ArrowRight size={16} /></>}
        </button>
      </form>
    );
  }

  // --- STANDARD ONE-LINER (For Shift Studio Beta Page) ---
  const copy = WEBSITE_COPY.JOIN_PAGE;
  
  return (
    <form ref={formRef} action={action} className="flex flex-col w-full max-w-md mx-auto animate-in fade-in duration-500">
      <ErrorBanner />
      <div className="flex flex-col sm:flex-row gap-3">
        <input type="hidden" name="source" value={source} />
        <input 
          type="email" 
          name="email" 
          required 
          placeholder={copy.INPUT_PLACEHOLDER} 
          className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white placeholder:text-white/20" 
        />
        <button type="submit" disabled={status === 'loading'} className="btn-brand flex items-center justify-center gap-2 px-6 rounded-full disabled:opacity-50">
          {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <>{copy.BTN_SUBMIT} <ArrowRight size={16} /></>}
        </button>
      </div>
    </form>
  );
}