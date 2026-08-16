/* src/components/portal/settings/SettingsModule.tsx */
'use client';

import React, { useState } from 'react';
import { User, Mail, Building, Phone, Shield, Save, CheckCircle2, ImagePlus, Loader2, Settings } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function SettingsModule({ clientConfig, storeId }: { clientConfig: any, storeId?: string }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: clientConfig?.primaryContact || '',
    email: '', 
    phone: '',
    agency: clientConfig?.agencyName || clientConfig?.name || '',
    brand_logo: clientConfig?.brand_logo || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (file: File) => {
    if (!storeId) return alert("Store ID missing.");
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${storeId}/live-brand_logo-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      
      // Update local state and push immediately to database
      setFormData(prev => ({ ...prev, brand_logo: data.publicUrl }));
      await supabase.from('storefronts').update({ brand_logo: data.publicUrl }).eq('id', storeId);
      
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
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated save for profile text
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-12 mt-2">
      <div className="mb-8 border-b border-white/5 pb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3">
          <Settings size={20} className="text-cyan-500" /> Workspace Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-mono">Manage your identity and security configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" /> Identity Data
            </h3>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Primary Contact</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Agency / Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="text" name="agency" value={formData.agency} onChange={handleChange} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 555-5555" className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button type="submit" disabled={isSaving} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50">
                {isSaving ? 'Saving...' : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Logo & Security */}
        <div className="space-y-6">
          {/* BRAND LOGO CARD */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col items-center justify-center relative">
            <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Brand Logo</span>
              <label className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} Swap
                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
              </label>
            </div>
            
            <div className="mt-12 mb-4 w-32 h-32 rounded-full bg-zinc-950 border-4 border-zinc-800/50 overflow-hidden relative flex items-center justify-center p-2 shadow-[0_0_30px_rgba(34,211,238,0.1)]">
              <img src={formData.brand_logo || 'https://placehold.co/400x400/18181b/a1a1aa?text=No+Logo'} alt="Logo" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* SECURITY STATUS */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" /> Security
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Your workspace is currently secured with enterprise-grade encryption. To update your access credentials, please request a secure reset link.
            </p>
            <button className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-colors">
              Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}