/* src/components/JoinForm.tsx */
'use client';

import React, { useRef, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { joinWaitlist } from '@/app/actions';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

// STRCIT TYPING: 'source' is now required. 
export default function JoinForm({ source }: { source: 'Shift Studio' | 'Agency Inquiry' }) {
  const { JOIN_PAGE } = WEBSITE_COPY;
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
      <div className="flex items-center gap-3 text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-6 py-4 rounded-full max-w-md w-full">
        <CheckCircle2 size={20} />
        <span className="text-xs font-bold uppercase tracking-widest">{JOIN_PAGE.SUCCESS_MSG}</span>
      </div>
    );
  }

  return (
    <form ref={formRef} action={action} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      {/* This hidden field safely passes our required source to the backend */}
      <input type="hidden" name="source" value={source} />
      
      <input 
        type="email" 
        name="email"
        required
        placeholder={JOIN_PAGE.INPUT_PLACEHOLDER}
        className="flex-1 bg-black/50 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors text-white placeholder:text-white/20"
      />
      
      <button type="submit" className="btn-brand flex items-center justify-center gap-2 px-6">
        {JOIN_PAGE.BTN_SUBMIT} <ArrowRight size={16} />
      </button>
    </form>
  );
}