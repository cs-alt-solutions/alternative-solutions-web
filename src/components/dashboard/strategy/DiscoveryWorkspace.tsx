/* src/components/dashboard/strategy/DiscoveryWorkspace.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  BrainCircuit, Handshake, Link as LinkIcon, Save, Loader2, 
  Plus, X, ExternalLink, Contact, Mail, Phone, AtSign, 
  Target, Type, Image as ImageIcon, CheckCircle2, Sparkles, Copy
} from 'lucide-react';

export default function DiscoveryWorkspace({ initialBoard }: { initialBoard: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isPushingToStore, setIsPushingToStore] = useState(false);
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  
  const [phases, setPhases] = useState(initialBoard.phases || {
    brain_dump: "",
    value_trade: "",
    competitor_links: []
  });
  
  const [newLink, setNewLink] = useState("");

  // Safely extract client info from the joined storefront data
  const store = initialBoard.storefronts || {};
  const email = store.contact_email || store.email || store.applicant_email;
  const phone = store.phone || store.contact_phone || store.applicant_phone;
  
  // Safely parse social handles from the database record
  const rawSocials = store.social_links || store.social_handles || store.socials || {};
  const socials = typeof rawSocials === 'string' ? JSON.parse(rawSocials) : rawSocials;

  // 🚀 Extract the Client's Onboarding Brain Dump from storefronts.application_data
  const rawAppData = typeof store.application_data === 'string' 
    ? JSON.parse(store.application_data) 
    : (store.application_data || {});
  const clientBrainDump = rawAppData?.brain_dump || null;

  const handleSave = async () => {
    setIsSaving(true);
    setSaveBanner(null);
    try {
      const { error } = await supabase
        .from('ideas_ledger')
        .update({ phases })
        .eq('id', initialBoard.id);
      
      if (error) throw error;
      setSaveBanner("Blueprint Saved");
      setTimeout(() => setSaveBanner(null), 3000);
    } catch (err) {
      console.error("Failed to save board:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // 🚀 Copy client's onboarding answers directly into your editable scratchpad
  const handlePullIntoScratchpad = () => {
    if (!clientBrainDump) return;
    const formattedNotes = [
      `--- CLIENT ONBOARDING BRAIN DUMP ---`,
      `• Primary Objective: ${clientBrainDump.goal || 'N/A'}`,
      `• Logo Status: ${clientBrainDump.logo || 'N/A'}`,
      `• Visuals Preference: ${clientBrainDump.visuals || 'N/A'}`,
      `------------------------------------`,
      phases.brain_dump || ''
    ].filter(Boolean).join('\n');

    setPhases((prev: any) => ({ ...prev, brain_dump: formattedNotes }));
  };

  // 🚀 Push client's primary objective straight into their Storefront subtext & about_bio
  const handlePushGoalToStorefront = async () => {
    if (!clientBrainDump?.goal || !store.id) return;
    if (!window.confirm("Push the client's Primary Objective into their Storefront Subtext & About Bio?")) return;

    setIsPushingToStore(true);
    try {
      const { error } = await supabase
        .from('storefronts')
        .update({
          subtext: clientBrainDump.goal,
          about_bio: clientBrainDump.goal
        })
        .eq('id', store.id);

      if (error) throw error;
      setSaveBanner("Pushed to Storefront!");
      setTimeout(() => setSaveBanner(null), 3000);
    } catch (err) {
      console.error("Failed to push to storefront:", err);
      alert("Failed to push details to storefront.");
    } finally {
      setIsPushingToStore(false);
    }
  };

  const addLink = () => {
    if (!newLink.trim()) return;
    setPhases((prev: any) => ({
      ...prev,
      competitor_links: [...(prev.competitor_links || []), newLink.trim()]
    }));
    setNewLink("");
  };

  const removeLink = (indexToRemove: number) => {
    setPhases((prev: any) => ({
      ...prev,
      competitor_links: (prev.competitor_links || []).filter((_: any, i: number) => i !== indexToRemove)
    }));
  };

  const renderSocials = () => {
    if (!socials || typeof socials !== 'object' || Object.keys(socials).length === 0) {
      return <p className="text-[10px] font-mono text-zinc-600 italic py-2">No social footprint provided.</p>;
    }

    return (
      <div className="flex flex-col gap-2 mt-2">
        {Object.entries(socials).map(([network, handle]) => {
          if (!handle) return null;
          const handleStr = String(handle);
          const url = handleStr.startsWith('http') ? handleStr : `https://${network}.com/${handleStr.replace('@', '')}`;
          return (
            <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-2 bg-black/40 border border-zinc-800/80 rounded-lg hover:border-indigo-500/30 group transition-all">
              <div className="flex items-center gap-2 min-w-0">
                <AtSign size={12} className="text-zinc-500 group-hover:text-indigo-400 transition-colors shrink-0" />
                <span className="text-xs font-mono text-zinc-300 capitalize truncate">{network}: {handleStr}</span>
              </div>
              <ExternalLink size={12} className="text-zinc-600 group-hover:text-indigo-400 transition-colors shrink-0" />
            </a>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border bg-amber-500/10 text-amber-500 border-amber-500/20">
              Active Discovery
            </span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Storefront ID: {initialBoard.storefront_id?.split('-')[0]}
            </span>
            {clientBrainDump && (
              <span className="px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border bg-emerald-500/10 text-emerald-400 border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 size={10} /> Client Brain Dump Synced
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
            {initialBoard.storefronts?.business_name || 'Unknown Client'}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {saveBanner && (
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 size={14} /> {saveBanner}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? 'Saving...' : 'Save Blueprint'}
          </button>
        </div>
      </div>

      {/* 3-COLUMN WAR ROOM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* COLUMN 1: Intake Profile & Contacts (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                <Contact size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Intake Profile</h2>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">Contact & Socials</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">Primary Email</label>
                {email ? (
                  <a href={`mailto:${email}`} className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors bg-black/40 border border-zinc-800/80 hover:border-cyan-500/30 px-3 py-2.5 rounded-lg group">
                    <Mail size={14} className="shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">{email}</span>
                  </a>
                ) : (
                  <div className="text-[10px] font-mono text-zinc-600 italic px-3 py-2 bg-black/20 border border-zinc-800/50 rounded-lg">Not provided in intake</div>
                )}
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">Phone Number</label>
                {phone ? (
                  <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors bg-black/40 border border-zinc-800/80 hover:border-amber-500/30 px-3 py-2.5 rounded-lg group">
                    <Phone size={14} className="shrink-0 group-hover:scale-110 transition-transform" /> <span className="truncate">{phone}</span>
                  </a>
                ) : (
                  <div className="text-[10px] font-mono text-zinc-600 italic px-3 py-2 bg-black/20 border border-zinc-800/50 rounded-lg">Not provided in intake</div>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80">
                <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">Digital Footprint</label>
                {renderSocials()}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 2: The Core Blueprints (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* THE BRAIN DUMP */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                  <BrainCircuit size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-black text-white uppercase tracking-widest">The Brain Dump</h2>
                  <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">Client onboarding answers & your architectural notes.</p>
                </div>
              </div>
            </div>

            {/* 🚀 LIVE CLIENT ONBOARDING ANSWERS CARD */}
            {clientBrainDump ? (
              <div className="p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-4 shadow-inner">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
                  <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} /> Client Portal Onboarding Responses
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePullIntoScratchpad}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[9px] font-bold uppercase tracking-widest transition-colors cursor-pointer"
                      title="Copy answers into your scratchpad below"
                    >
                      <Copy size={10} /> Copy to Notes
                    </button>
                    <button
                      type="button"
                      onClick={handlePushGoalToStorefront}
                      disabled={isPushingToStore}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-300 border border-cyan-500/40 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                      title="Push objective into Storefront Subtext & Bio"
                    >
                      {isPushingToStore ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                      Push to Storefront
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">Primary Objective (#1 Goal)</span>
                  <p className="text-sm text-white font-medium leading-relaxed bg-black/40 p-3 rounded-lg border border-white/5">
                    "{clientBrainDump.goal || 'No objective entered yet.'}"
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <Type size={11} className="text-cyan-400" /> Logo Status
                    </span>
                    <p className="text-xs font-bold text-zinc-200">{clientBrainDump.logo || 'Pending'}</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded-lg border border-white/5">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <ImageIcon size={11} className="text-cyan-400" /> Visual Direction
                    </span>
                    <p className="text-xs font-bold text-zinc-200">{clientBrainDump.visuals || 'Pending'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-black/30 border border-dashed border-zinc-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                  Awaiting client's portal Brain Dump submission...
                </span>
                <span className="text-[9px] font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">
                  Onboarding
                </span>
              </div>
            )}

            {/* ARCHITECT SCRATCHPAD */}
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-2">
                Architect Scratchpad & Call Notes
              </label>
              <textarea 
                value={phases.brain_dump || ''}
                onChange={(e) => setPhases({...phases, brain_dump: e.target.value})}
                placeholder="What did they say on the phone? What are their core vibes?"
                className="w-full h-[240px] bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:border-cyan-500 focus:outline-none resize-none custom-scrollbar shadow-inner"
              />
            </div>
          </div>

          {/* THE VALUE-TRADE LEDGER */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20">
                <Handshake size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Value-Trade Ledger</h2>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">Bartering arrangements and alternate compensation.</p>
              </div>
            </div>
            <textarea 
              value={phases.value_trade || ''}
              onChange={(e) => setPhases({...phases, value_trade: e.target.value})}
              placeholder="e.g., Exchanging full storefront build ($1,500 value) for 3 months of goat labor and land clearing..."
              className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs font-mono text-zinc-300 focus:border-fuchsia-500 focus:outline-none resize-none custom-scrollbar shadow-inner"
            />
          </div>
        </div>

        {/* COLUMN 3: Inspiration & Competitors (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 border border-emerald-500/20">
                <LinkIcon size={18} />
              </div>
              <div>
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Inspiration Board</h2>
                <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">Competitor links.</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <input 
                type="url"
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addLink()}
                placeholder="https://..."
                className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-white focus:border-emerald-500 focus:outline-none shadow-inner"
              />
              <button 
                onClick={addLink}
                disabled={!newLink.trim()}
                className="px-3 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 max-h-[450px]">
              {(!phases.competitor_links || phases.competitor_links.length === 0) ? (
                <p className="text-[10px] font-mono text-zinc-600 italic text-center py-8">No links tracked yet.</p>
              ) : (
                phases.competitor_links.map((link: string, i: number) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800 rounded-lg group hover:border-emerald-500/30 transition-colors">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 flex-1 min-w-0">
                      <ExternalLink size={12} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-mono text-zinc-300 truncate hover:text-emerald-400 transition-colors">{link}</span>
                    </a>
                    <button 
                      onClick={() => removeLink(i)}
                      className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}