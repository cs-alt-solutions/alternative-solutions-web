/* src/components/JoinForm.tsx */
'use client';

import React, { useRef, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { joinWaitlist } from '@/app/actions';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function JoinForm({ source }: { source: 'Shift Studio' | 'Agency Inquiry' }) {
  // DYNAMIC COPY: Grab the correct wording based on where this form is placed
  const copy = source === 'Agency Inquiry' ? WEBSITE_COPY.AGENCY_HOOK : WEBSITE_COPY.JOIN_PAGE;
  
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    const res = await joinWaitlist(formData);
    if (res?.success) {
      setSubmitted(true);
      formRef.current?.reset();
    }
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-6 py-4 rounded-full max-w-md w-full animate-in fade-in duration-300">
        <CheckCircle2 size={20} />
        <span className="text-xs font-bold uppercase tracking-widest">{copy.SUCCESS_MSG}</span>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input type="hidden" name="source" value={source} />
      
      <input 
        type="email" 
        name="email"
        required
        placeholder={copy.INPUT_PLACEHOLDER}
        className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white placeholder:text-white/20"
      />
      
      <button type="submit" className="btn-brand flex items-center justify-center gap-2 px-6">
        {copy.BTN_SUBMIT} <ArrowRight size={16} />
      </button>
    </form>
  );
}