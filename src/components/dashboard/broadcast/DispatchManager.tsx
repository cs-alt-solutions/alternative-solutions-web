/* src/components/dashboard/broadcast/DispatchManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Send, History, Radio, Power, CheckCircle2, Loader2, Trash2, Zap, MessageSquare, Code2, Plus, GripVertical } from 'lucide-react';

const CATEGORIES = {
  'QUICK COMMS': {
    icon: MessageSquare,
    label: 'Quick Update',
    presets: ['Platform Notice', 'Maintenance Scheduled', 'Quick Check-in', 'Custom...']
  },
  'FEATURE DROP': {
    icon: Zap,
    label: 'New Feature',
    presets: ['New Feature Live', 'Module Expansion', 'Portal Upgrade', 'Custom...']
  },
  'ARCHITECTURE': {
    icon: Code2,
    label: 'Architecture',
    presets: ['System Optimization', 'Security Patch', 'Infrastructure Update', 'Custom...']
  }
};

export default function DispatchManager({ initialUpdates }: { initialUpdates: any[] }) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [category, setCategory] = useState<keyof typeof CATEGORIES>('QUICK COMMS');
  const [version, setVersion] = useState('');
  
  // Title State
  const [selectedPreset, setSelectedPreset] = useState(CATEGORIES['QUICK COMMS'].presets[0]);
  const [customTitle, setCustomTitle] = useState('');

  // Structured Body State
  const [intro, setIntro] = useState('');
  const [bullets, setBullets] = useState<string[]>(['']);
  
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleCategoryChange = (catId: keyof typeof CATEGORIES) => {
    setCategory(catId);
    setSelectedPreset(CATEGORIES[catId].presets[0]);
    setCustomTitle('');
  };

  const handleAddBullet = () => setBullets([...bullets, '']);
  
  const handleUpdateBullet = (index: number, value: string) => {
    const newBullets = [...bullets];
    newBullets[index] = value;
    setBullets(newBullets);
  };

  const handleRemoveBullet = (index: number) => {
    setBullets(bullets.filter((_, i) => i !== index));
  };

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = selectedPreset === 'Custom...' ? customTitle : selectedPreset;
    
    // Stitch intro and valid bullets together for the database
    const validBullets = bullets.filter(b => b.trim());
    const finalBody = `${intro.trim()}${validBullets.length > 0 ? '\n\n' + validBullets.map(b => `• ${b}`).join('\n') : ''}`;

    if (!finalTitle.trim() || !finalBody.trim()) return;

    setIsSending(true);
    try {
      const activeIds = updates.filter(u => u.is_active).map(u => u.id);
      if (activeIds.length > 0) {
        await supabase.from('platform_updates').update({ is_active: false }).in('id', activeIds);
      }

      const { data, error } = await supabase
        .from('platform_updates')
        .insert([{ 
          title: finalTitle, 
          body: finalBody, 
          category,
          version: version.trim() || null,
          is_active: true 
        }])
        .select()
        .single();

      if (error) throw error;

      setUpdates(prev => [data, ...prev.map(u => ({ ...u, is_active: false }))]);
      
      // Reset Form
      setIntro('');
      setBullets(['']);
      setVersion('');
      setCustomTitle('');
      
      setFeedback('Transmission live. All client portals updated.');
      setTimeout(() => setFeedback(''), 5000);
    } catch (err) {
      console.error("Broadcast failed", err);
      alert("Failed to transmit broadcast. Check console for details.");
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, is_active: newStatus } : u));
    await supabase.from('platform_updates').update({ is_active: newStatus }).eq('id', id);
  };
  
  const handleDelete = async (id: string) => {
    if(!window.confirm("Permanently delete this dispatch log?")) return;
    setUpdates(prev => prev.filter(u => u.id !== id));
    await supabase.from('platform_updates').delete().eq('id', id);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* LEFT COLUMN: The Composer */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        <div className="bg-zinc-950 border border-white/5 rounded-3xl shadow-2xl overflow-hidden relative">
          
          {feedback && (
            <div className="absolute inset-0 z-50 bg-cyan-950/90 backdrop-blur-md flex flex-col items-center justify-center text-cyan-400 animate-in fade-in">
              <CheckCircle2 size={48} className="mb-4" />
              <h3 className="text-xl font-black uppercase tracking-widest">{feedback}</h3>
            </div>
          )}

          <div className="p-6 md:p-8 border-b border-white/5 bg-cyan-500/5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shrink-0">
              <Send className="text-cyan-400 w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">New Transmission</h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Broadcast directly to all client dashboards</p>
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="p-6 md:p-8 space-y-8">
            
            {/* FAST CATEGORY TOGGLES */}
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3 block">
                Transmission Type
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {Object.entries(CATEGORIES).map(([catId, config]) => {
                  const isActive = category === catId;
                  return (
                    <button
                      key={catId}
                      type="button"
                      onClick={() => handleCategoryChange(catId as keyof typeof CATEGORIES)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                          : 'bg-black/40 text-zinc-500 border border-white/5 hover:border-white/10 hover:text-zinc-300'
                      }`}
                    >
                      <config.icon size={14} /> {config.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              
              {/* PRESET TITLE DROPDOWN */}
              <div className={category === 'QUICK COMMS' ? 'md:col-span-4' : 'md:col-span-3'}>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                  Standardized Header
                </label>
                <div className="flex flex-col gap-3">
                  <select 
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none transition-colors shadow-inner appearance-none cursor-pointer"
                  >
                    {CATEGORIES[category].presets.map(preset => (
                      <option key={preset} value={preset}>{preset}</option>
                    ))}
                  </select>

                  {/* CUSTOM OVERRIDE */}
                  {selectedPreset === 'Custom...' && (
                    <input 
                      type="text" 
                      autoFocus
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      placeholder="Enter custom transmission title..." 
                      className="w-full bg-black/40 border border-cyan-500/30 focus:border-cyan-500/80 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none transition-colors shadow-inner animate-in slide-in-from-top-2"
                    />
                  )}
                </div>
              </div>

              {category !== 'QUICK COMMS' && (
                <div className="md:col-span-1 animate-in fade-in zoom-in-95 duration-200">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                    Version
                  </label>
                  <input 
                    type="text" 
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="v1.2.0" 
                    className="w-full bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-cyan-400 font-mono font-bold tracking-wide outline-none transition-colors shadow-inner text-center"
                  />
                </div>
              )}
            </div>

            {/* STRUCTURED BODY BUILDER */}
            <div className="flex-1 flex flex-col p-5 border border-zinc-800 rounded-2xl bg-black/20 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                  Brief Intro
                </label>
                <textarea 
                  value={intro}
                  onChange={(e) => setIntro(e.target.value)}
                  placeholder="What is the high-level summary of this update?"
                  className="w-full h-24 bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-xl p-4 text-sm text-zinc-300 outline-none custom-scrollbar resize-none font-medium leading-relaxed shadow-inner"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                  Feature Points (Optional)
                </label>
                <div className="space-y-3">
                  {bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3 group">
                      <div className="mt-2 text-zinc-600 group-hover:text-cyan-500/50 transition-colors">
                        <GripVertical size={16} />
                      </div>
                      <input 
                        type="text" 
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(index, e.target.value)}
                        placeholder="Added new asset dropping logic..."
                        className="flex-1 bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-lg px-4 py-2.5 text-sm text-zinc-300 outline-none transition-colors shadow-inner"
                      />
                      <button 
                        type="button"
                        onClick={() => handleRemoveBullet(index)}
                        className="mt-2 text-zinc-600 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button 
                  type="button"
                  onClick={handleAddBullet}
                  className="mt-4 flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors"
                >
                  <Plus size={14} /> Add Bullet Point
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                disabled={isSending || (!selectedPreset.trim() && !customTitle.trim()) || !intro.trim()}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-cyan-950 px-8 py-3.5 rounded-xl font-mono text-[11px] uppercase font-black tracking-widest transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] disabled:opacity-50 cursor-pointer"
              >
                {isSending ? <Loader2 size={16} className="animate-spin" /> : <><Send size={16} /> Transmit</>}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: Transmission History */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        <div className="bg-zinc-950 border border-white/5 rounded-3xl shadow-xl flex flex-col h-200">
          <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-zinc-500" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">History Log</h2>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {updates.length} Logs
            </span>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {updates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 border border-dashed border-zinc-800/50 rounded-2xl bg-zinc-900/20 p-6">
                <Radio size={24} className="mb-3 opacity-50" />
                <p className="text-xs font-mono uppercase tracking-widest">No previous transmissions.</p>
              </div>
            ) : (
              updates.map((update) => (
                <div key={update.id} className={`p-5 rounded-2xl border transition-all ${update.is_active ? 'bg-cyan-500/5 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${update.is_active ? 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' : 'bg-zinc-800 border-zinc-700 text-zinc-400'}`}>
                      {update.category || 'QUICK COMMS'}
                    </span>
                    {update.version && (
                      <span className={`text-[8px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${update.is_active ? 'border-cyan-500/20 text-cyan-500/70' : 'border-zinc-800 text-zinc-500'}`}>
                        {update.version}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className={`text-xs font-bold leading-snug ${update.is_active ? 'text-cyan-400' : 'text-white'}`}>
                      {update.title}
                    </h3>
                    <button 
                      onClick={() => handleToggleActive(update.id, update.is_active)}
                      className={`shrink-0 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        update.is_active 
                          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-400' 
                          : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/20'
                      }`}
                      title={update.is_active ? "Deactivate Broadcast" : "Set Active"}
                    >
                      <Power size={14} />
                    </button>
                  </div>
                  
                  <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed mb-4 whitespace-pre-wrap">
                    {update.body}
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-3">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">
                      {new Date(update.created_at).toLocaleDateString()}
                    </span>
                    <button 
                      onClick={() => handleDelete(update.id)}
                      className="text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Delete Log"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}