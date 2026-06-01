/* src/components/portal/core/ClientProfile.tsx */
'use client';

import React, { useState } from 'react';
import { User, Mail, Building, Phone, Shield, Save, CheckCircle2 } from 'lucide-react';

export default function ClientProfile({ clientConfig }: { clientConfig: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Pre-fill state with their config data
  const [formData, setFormData] = useState({
    name: clientConfig?.primaryContact || '',
    email: '', // We would normally pull this from Supabase auth
    phone: '',
    agency: clientConfig?.agencyName || clientConfig?.name || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate database update delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl animate-in fade-in duration-500">
      
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white uppercase tracking-widest">Workspace Profile</h2>
        <p className="text-sm text-slate-400 mt-1">Manage your identity and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-cyan-500" /> Identity Data
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Primary Contact</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="admin@example.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Agency / Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text" 
                      name="agency"
                      value={formData.agency}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(555) 555-5555"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
              <button 
                type="submit" 
                disabled={isSaving}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security/Status */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
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

          <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
             <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest block mb-1">System Status</span>
             <span className="text-sm font-bold text-white uppercase tracking-widest">{clientConfig?.systemStatus || 'Online'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}