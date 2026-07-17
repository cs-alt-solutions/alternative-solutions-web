'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, Mail, Phone, Sparkles, ArrowLeft } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  isValid: boolean; 
}

export default function Step1Basics({ formData, setFormData, onNext }: Step1Props) {
  const router = useRouter();
  const copy = WIZARD_COPY.STEP_1;

  // --- Strict Phone Formatter ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '').substring(0, 10);
    let formatted = input;
    if (input.length > 6) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}-${input.substring(6, 10)}`;
    } else if (input.length > 3) {
      formatted = `(${input.substring(0, 3)}) ${input.substring(3, 6)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    setFormData({ ...formData, phone: formatted });
  };

  // --- Strict Validation Logic ---
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPhoneValid = formData.phone.length === 14; 
  
  const isLocalValid = 
    formData.name.trim() !== '' && 
    formData.projectName.trim() !== '' && 
    formData.description.trim() !== '' && 
    isEmailValid && 
    isPhoneValid;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      
      {/* THE HOOK (Dynamic Copy) */}
      <div className="space-y-4 mb-2">
        <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-indigo-500">{copy.TITLE_PUNCT}</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl leading-relaxed">
          {copy.SUBTITLE}
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 md:p-8 rounded-3xl shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 group">
              <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">{copy.LABELS.NAME}</label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                  placeholder={copy.PLACEHOLDERS.NAME} 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">{copy.LABELS.BUSINESS}</label>
              <div className="relative">
                <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  required 
                  value={formData.projectName}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:border-blue-500 focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600" 
                  placeholder={copy.PLACEHOLDERS.BUSINESS} 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-end pr-2">
                <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">{copy.LABELS.EMAIL}</label>
                {formData.email.length > 0 && !isEmailValid && (
                  <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest animate-pulse">{copy.VALIDATION.INVALID_EMAIL}</span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-zinc-900/50 border rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600 ${formData.email.length > 0 && !isEmailValid ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-blue-500'}`}
                  placeholder={copy.PLACEHOLDERS.EMAIL} 
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-end pr-2">
                <label className="text-sm font-bold text-zinc-400 pl-2 group-focus-within:text-blue-400 transition-colors">{copy.LABELS.PHONE}</label>
                {formData.phone.length > 0 && !isPhoneValid && (
                  <span className="text-[10px] text-red-400 font-mono uppercase tracking-widest animate-pulse">{copy.VALIDATION.INCOMPLETE_PHONE}</span>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-zinc-900/50 border rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:bg-zinc-900 transition-all text-lg shadow-inner placeholder:text-zinc-600 ${formData.phone.length > 0 && !isPhoneValid ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800 focus:border-blue-500'}`}
                  placeholder={copy.PLACEHOLDERS.PHONE} 
                />
              </div>
            </div>

          </div>
        </div>

        <div className="bg-black/40 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden group focus-within:border-blue-500/50 transition-colors shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-focus-within:via-blue-500/50 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-white tracking-wide">{copy.CANVAS.TITLE}</h3>
              <p className="text-sm text-zinc-500 mt-1">{copy.CANVAS.SUBTITLE}</p>
            </div>
          </div>

          <textarea 
            required 
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-transparent border-none text-white focus:ring-0 text-xl md:text-2xl font-light placeholder:text-zinc-700 resize-none leading-relaxed px-0" 
            placeholder={copy.PLACEHOLDERS.DESCRIPTION} 
          />
        </div>
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-8 border-t border-zinc-800/50 gap-6">
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-sm font-bold text-zinc-500 hover:text-white transition-colors flex items-center gap-2 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {copy.ACTIONS.CANCEL}
        </button>

        <button 
          type="button" 
          onClick={onNext}
          disabled={!isLocalValid}
          className={`relative overflow-hidden w-full md:w-auto px-10 py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${isLocalValid ? 'text-white border border-blue-500/50 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:scale-[1.02]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          {isLocalValid && (
            <div className="absolute left-0 top-0 h-full w-[25%] bg-linear-to-r from-blue-600 to-indigo-500 opacity-60 transition-all duration-700 ease-out"></div>
          )}
          <span className="relative z-10">{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}