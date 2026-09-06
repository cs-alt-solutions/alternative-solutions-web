/* src/components/dashboard/broadcast/DispatchManager.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Send, History, Radio, Power, CheckCircle2, Loader2, Trash2 } from 'lucide-react';

export default function DispatchManager({ initialUpdates }: { initialUpdates: any[] }) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSending(true);
    try {
      // 1. Auto-deactivate older active broadcasts so only the new one shows
      const activeIds = updates.filter(u => u.is_active).map(u => u.id);
      if (activeIds.length > 0) {
        await supabase.from('platform_updates').update({ is_active: false }).in('id', activeIds);
      }

      // 2. Insert the new broadcast
      const { data, error } = await supabase
        .from('platform_updates')
        .insert([{ title, body, is_active: true }])
        .select()
        .single();

      if (error) throw error;

      // 3. Update local state
      setUpdates(prev => [data, ...prev.map(u => ({ ...u, is_active: false }))]);
      setTitle('');
      setBody('');
      
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
    // Update local state instantly for snappy UI
    setUpdates(prev => prev.map(u => u.id === id ? { ...u, is_active: newStatus } : u));
    // Sync with database
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

          <form onSubmit={handleBroadcast} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                Header / Title
              </label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. System Online: New Features Deployed" 
                className="w-full bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-xl px-4 py-3 text-sm text-white font-bold tracking-wide outline-none transition-colors shadow-inner"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                Transmission Body
              </label>
              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What do your clients need to know today?"
                className="w-full h-64 bg-black/40 border border-zinc-800 focus:border-cyan-500/50 rounded-xl p-4 text-sm text-zinc-300 outline-none custom-scrollbar resize-none font-medium leading-relaxed shadow-inner"
              />
            </div>

            <div className="pt-4 border-t border-white/5 flex justify-end">
              <button 
                type="submit"
                disabled={isSending || !title.trim() || !body.trim()}
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
                  
                  <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed mb-4">
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