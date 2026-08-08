/* src/components/storefronts/wizard/Step1Basics.tsx */
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Briefcase, Mail, Phone, ArrowLeft, CheckCircle2, Wand2, Sparkles, Image as ImageIcon, UploadCloud, FileImage } from 'lucide-react';
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

  const [hookMode, setHookMode] = useState<'type' | 'delegate' | null>(
    formData?.tagline && formData.tagline !== 'ARCHITECT_DELEGATED' ? 'type' : 
    formData?.tagline === 'ARCHITECT_DELEGATED' ? 'delegate' : null
  );

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, [fieldName]: e.target.files[0] });
    }
  };

  const currentEmail = formData?.email || '';
  const currentPhone = formData?.phone || '';

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail);
  const isPhoneValid = currentPhone.length === 14; 

  const isLocalValid = 
    (formData?.name || '').trim() !== '' && 
    (formData?.projectName || '').trim() !== '' && 
    isEmailValid && 
    isPhoneValid &&
    (hookMode === 'delegate' || (hookMode === 'type' && (formData?.tagline || '').trim() !== ''));

  const handleSelectDelegate = () => {
    setHookMode('delegate');
    setFormData({ ...formData, tagline: 'ARCHITECT_DELEGATED', subtext: '' });
  };

  const handleSelectType = () => {
    setHookMode('type');
    if (formData?.tagline === 'ARCHITECT_DELEGATED') {
      setFormData({ ...formData, tagline: '', subtext: '' });
    }
  };

  // Reusable File Dropzone Component
  const UploadZone = ({ title, field, icon, description }: { title: string, field: string, icon: React.ReactNode, description: string }) => {
    const file = formData[field] as File | null;
    const previewUrl = file ? URL.createObjectURL(file) : null;

    return (
      <div className="relative group rounded-2xl border border-zinc-800/80 bg-zinc-950/40 p-4 hover:border-cyan-500/50 transition-all cursor-pointer overflow-hidden flex flex-col h-32 justify-center items-center text-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleFileChange(e, field)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        {previewUrl ? (
          <>
            <div className="absolute inset-0 bg-black/60 z-0"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none" />
            <div className="relative z-0 flex flex-col items-center gap-2 text-emerald-400">
              <CheckCircle2 size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Asset Secured</span>
            </div>
          </>
        ) : (
          <div className="relative z-0 flex flex-col items-center gap-2 text-zinc-500 group-hover:text-cyan-400 transition-colors">
            {icon}
            <div>
              <span className="block text-xs font-bold text-zinc-300">{title}</span>
              <span className="block text-[10px] uppercase tracking-wider opacity-60 mt-0.5">{description}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-10">
      
      {/* THE WELCOME HOOK */}
      <div className="space-y-2 mb-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-fuchsia-400 to-indigo-500 animate-text-gradient">{copy.TITLE_PUNCT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed font-normal">
          {copy.SUBTITLE}
        </p>
      </div>

      <div className="space-y-6">
        
        {/* CARD 1: CONTACT & BUSINESS SPECS */}
        <div className="bg-zinc-900/30 border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-zinc-300 pl-1 group-focus-within:text-cyan-400 transition-colors block">{copy.LABELS.NAME}</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" required value={formData?.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all text-sm placeholder:text-zinc-600 font-normal shadow-inner" 
                  placeholder={copy.PLACEHOLDERS.NAME} 
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-zinc-300 pl-1 group-focus-within:text-cyan-400 transition-colors block">{copy.LABELS.BUSINESS}</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="text" required value={formData?.projectName || ''}
                  onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-cyan-500/50 transition-all text-sm placeholder:text-zinc-600 font-normal shadow-inner" 
                  placeholder={copy.PLACEHOLDERS.BUSINESS} 
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-baseline pr-1">
                <label className="text-xs font-semibold text-zinc-300 pl-1 group-focus-within:text-cyan-400 transition-colors block">{copy.LABELS.EMAIL}</label>
                {currentEmail.length > 0 && !isEmailValid && (
                  <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider animate-pulse">{copy.VALIDATION.INVALID_EMAIL}</span>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="email" required value={currentEmail}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full bg-zinc-950/60 border rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 focus:outline-none transition-all text-sm placeholder:text-zinc-600 font-normal shadow-inner ${currentEmail.length > 0 && !isEmailValid ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800/80 focus:border-cyan-500/50'}`}
                  placeholder={copy.PLACEHOLDERS.EMAIL} 
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-baseline pr-1">
                <label className="text-xs font-semibold text-zinc-300 pl-1 group-focus-within:text-cyan-400 transition-colors block">{copy.LABELS.PHONE}</label>
                {currentPhone.length > 0 && !isPhoneValid && (
                  <span className="text-[10px] text-red-400 font-medium uppercase tracking-wider animate-pulse">{copy.VALIDATION.INCOMPLETE_PHONE}</span>
                )}
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                <input 
                  type="tel" required value={currentPhone}
                  onChange={handlePhoneChange}
                  className={`w-full bg-zinc-950/60 border rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 focus:outline-none transition-all text-sm placeholder:text-zinc-600 font-normal shadow-inner ${currentPhone.length > 0 && !isPhoneValid ? 'border-red-500/50 focus:border-red-500' : 'border-zinc-800/80 focus:border-cyan-500/50'}`}
                  placeholder={copy.PLACEHOLDERS.PHONE} 
                />
              </div>
            </div>

          </div>
        </div>

        {/* CARD 2: THE ASSET INGESTION ZONE */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <span>Visual Architecture (Optional)</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 font-normal max-w-xl">
              Do you already have a logo, a specific background image, or a photo of yourself for the "About" section? Drop them here so we can architect your layout around them.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <UploadZone 
              title="Brand Logo" field="logoFile" description="PNG or SVG preferred" 
              icon={<UploadCloud size={24} />} 
            />
            {/* FIXED: No more slashes */}
            <UploadZone 
              title="Hero Background" field="bgFile" description="High-res imagery" 
              icon={<FileImage size={24} />} 
            />
            {/* FIXED: No more slashes */}
            <UploadZone 
              title="Founder Portrait" field="aboutFile" description="Show your face" 
              icon={<User size={24} />} 
            />
          </div>
        </div>

        {/* CARD 3: THE CATCHY HEADLINE TOGGLE */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 md:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-fuchsia-400" />
              <span>{copy.HOOK_TOGGLE.TITLE}</span>
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 font-normal max-w-xl">
              {copy.HOOK_TOGGLE.SUBTITLE}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleSelectType}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer group ${
                hookMode === 'type' 
                  ? 'bg-zinc-900/80 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
                  : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {copy.HOOK_TOGGLE.BTN_YES_LABEL}
                </span>
                {hookMode === 'type' && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
              </div>
              <p className="text-xs text-zinc-400 font-normal">
                {copy.HOOK_TOGGLE.BTN_YES_DESC}
              </p>
            </button>

            <button
              type="button"
              onClick={handleSelectDelegate}
              className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer group ${
                hookMode === 'delegate' 
                  ? 'bg-zinc-900/80 border-fuchsia-400/80 shadow-[0_0_15px_rgba(232,121,249,0.1)]' 
                  : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                  {copy.HOOK_TOGGLE.BTN_NO_LABEL}
                </span>
                {hookMode === 'delegate' && <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />}
              </div>
              <p className="text-xs text-zinc-400 font-normal">
                {copy.HOOK_TOGGLE.BTN_NO_DESC}
              </p>
            </button>
          </div>

          {hookMode === 'delegate' && (
            <div className="p-3.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-xs font-normal flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <Sparkles className="w-4 h-4 text-fuchsia-400 shrink-0 animate-pulse" />
              <span>{copy.HOOK_TOGGLE.DELEGATED_BADGE}</span>
            </div>
          )}

          {hookMode === 'type' && (
            <div className="space-y-6 pt-4 border-t border-zinc-800/60 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 block pl-1">
                  {copy.LABELS.TAGLINE}
                </label>
                <textarea 
                  rows={2} value={formData?.tagline || ''}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500/50 text-sm font-normal placeholder:text-zinc-600 transition-all shadow-inner resize-none"
                  placeholder={copy.PLACEHOLDERS.TAGLINE}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-200 block pl-1">
                  {copy.LABELS.SUBTEXT}
                </label>
                <textarea 
                  rows={3} value={formData?.subtext || ''}
                  onChange={(e) => setFormData({...formData, subtext: e.target.value})}
                  className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-zinc-100 focus:outline-none focus:border-cyan-500/50 text-sm font-normal placeholder:text-zinc-600 transition-all shadow-inner resize-none"
                  placeholder={copy.PLACEHOLDERS.SUBTEXT}
                />
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-4 border-t border-zinc-800/60 gap-4">
        <button type="button" onClick={() => router.push('/')} className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 group">
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          {copy.ACTIONS.CANCEL}
        </button>
        <button 
          type="button" onClick={onNext} disabled={!isLocalValid}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all ${isLocalValid ? 'text-zinc-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.01]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          <span>{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}