/* src/components/portal/settings/SettingsModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, CheckCircle2, ImagePlus, Loader2, Settings, Lock, Info, Building2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import SecureTransfer from './secure-transfer/SecureTransfer';

export default function SettingsModule({ clientId }: { clientId: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    business_name: '',
    contact_email: '', 
    primary_contact: '', 
    brand_logo: '',
  });

  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await supabase.from('storefronts').select('*').eq('id', clientId).single();
      if (data) {
        setFormData({
          business_name: data.business_name || '',
          contact_email: data.contact_email || '',
          primary_contact: data.primary_contact || '',
          brand_logo: data.brand_logo || '',
        });
      }
      setIsLoading(false);
    };
    fetchStore();
  }, [clientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${clientId}/live-brand_logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, brand_logo: data.publicUrl }));
      await supabase.from('storefronts').update({ brand_logo: data.publicUrl }).eq('id', clientId);
      
    } catch (error) {
      console.error(error);
      alert("Failed to upload logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    await supabase.from('storefronts').update({
      primary_contact: formData.primary_contact,
    }).eq('id', clientId);
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (isLoading) return <div className="p-12 text-center text-cyan-500 animate-pulse font-mono text-xs uppercase tracking-widest">Loading Settings...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Settings size={20} className="text-cyan-500" /> Workspace Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">Manage your identity and secured documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: IDENTITY FORM */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-zinc-950 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-white/5 pb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" /> Core Identity
            </h3>
            
            <div className="space-y-8 flex-1">
              
              {/* LOCKED IDENTITY FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-black/40 rounded-2xl border border-dashed border-zinc-800">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Lock size={10} className="text-rose-500" /> Workspace Name
                  </label>
                  <div className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-zinc-400 cursor-not-allowed">
                    {formData.business_name}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <Lock size={10} className="text-rose-500" /> Account Email
                  </label>
                  <div className="w-full bg-transparent border-b border-zinc-800 py-2 text-sm text-zinc-400 cursor-not-allowed truncate">
                    {formData.contact_email}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 flex items-start gap-2 text-[10px] text-zinc-600 font-mono uppercase tracking-widest mt-2">
                  <Info size={12} className="shrink-0 text-cyan-500/50 mt-0.5" />
                  <p>To transfer workspace ownership or change your registered business entity, please contact architecture support.</p>
                </div>
              </div>

              {/* EDITABLE PERSONAL FIELDS */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">Account Owner Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    name="primary_contact" 
                    value={formData.primary_contact} 
                    onChange={handleChange} 
                    placeholder="Your full name"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-zinc-700" 
                  />
                </div>
              </div>
              
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50">
                {isSaving ? 'Saving...' : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: LOGO & SECURITY */}
        <div className="space-y-6">
          
          {/* BRAND LOGO CARD */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center relative min-h-[260px]">
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Brand Logo</span>
              <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Swap
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </label>
            </div>
            
            <div className="mt-8 w-36 h-36 rounded-full bg-zinc-900 border-2 border-zinc-800/50 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(34,211,238,0.05)] overflow-hidden">
              {formData.brand_logo ? (
                <img src={formData.brand_logo} alt="Logo" className="w-full h-full object-contain rounded-full" />
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 gap-2">
                  <Building2 size={24} className="opacity-50" />
                  <span className="text-[9px] font-bold uppercase tracking-widest">No Logo</span>
                </div>
              )}
            </div>
          </div>

          {/* AUTHENTICATION CARD */}
          <div className="bg-zinc-950 border border-white/5 rounded-3xl p-6 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Authentication
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your workspace is secured with passwordless, enterprise-grade magic link authentication. Access is strictly bound to your verified email address. No passwords to remember, expose, or reset.
            </p>
          </div>
          
        </div>

      </div>

      <div className="mt-12 pt-12 border-t border-white/5">
        <SecureTransfer clientId={clientId} />
      </div>

    </div>
  );
}