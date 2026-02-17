/* src/app/dashboard/broadcast/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { updateAudioLog, archiveAudioLog, toggleAudioLogStatus } from '@/app/actions';
import { 
  ArrowLeft, Edit2, Trash2, Save, X, Mic2, 
  Loader2, Radio, Share2, Mail, Eye, EyeOff 
} from 'lucide-react';

export default function BroadcastHub() {
  const copy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB;
  const audioCopy = copy.AUDIO_MODULE;
  
  const [activeTab, setActiveTab] = useState<'AUDIO' | 'SOCIAL' | 'CAMPAIGNS'>('AUDIO');
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function fetchLogs() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('audio_logs')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) setLogs(data);
    setIsLoading(false);
  }

  useEffect(() => {
    if (activeTab === 'AUDIO') fetchLogs();
  }, [activeTab]);

  async function handleArchive(id: string) {
    if (!window.confirm("Are you sure you want to archive this transmission?")) return;
    const formData = new FormData();
    formData.append('id', id);
    await archiveAudioLog(formData);
    fetchLogs(); 
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('id', id);
    await updateAudioLog(formData);
    setEditingId(null); 
    fetchLogs(); 
  }

  async function handleToggleStatus(id: string, currentStatus: string) {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('currentStatus', currentStatus || 'ACTIVE');
    await toggleAudioLogStatus(formData);
    fetchLogs();
  }

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-6xl mx-auto w-full relative z-10 flex-1 flex flex-col pb-24">
          
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-primary hover:border-brand-primary/30 transition-all">
              <ArrowLeft size={16} />
            </Link>
            <div>
               <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy.TITLE}</h1>
               <div className="flex items-center gap-2 mt-1">
                 <Radio size={12} className="text-brand-primary animate-pulse" />
                 <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
                   MASTER COMMAND
                 </span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-px">
            <button 
              onClick={() => setActiveTab('AUDIO')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'AUDIO' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Mic2 size={14} /> {copy.TABS.AUDIO}
            </button>
            <button 
              onClick={() => setActiveTab('SOCIAL')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'SOCIAL' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Share2 size={14} /> {copy.TABS.SOCIAL}
            </button>
            <button 
              onClick={() => setActiveTab('CAMPAIGNS')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'CAMPAIGNS' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Mail size={14} /> {copy.TABS.CAMPAIGNS}
            </button>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl shadow-2xl flex-1 flex flex-col backdrop-blur-sm relative z-20 overflow-hidden">
             
             {activeTab === 'AUDIO' && (
               <div className="flex-1 overflow-auto relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-brand-primary/50" size={24} />
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm">
                       <thead className="bg-black/60 sticky top-0 z-10 text-white/40 font-mono text-[10px] uppercase border-b border-white/5">
                         <tr>
                           <th className="px-6 py-4 font-normal tracking-wider">{audioCopy.COLUMNS.TITLE}</th>
                           <th className="px-6 py-4 font-normal tracking-wider w-32">{audioCopy.COLUMNS.DATE}</th>
                           <th className="px-6 py-4 font-normal tracking-wider w-32">{audioCopy.COLUMNS.DURATION}</th>
                           <th className="px-6 py-4 font-normal tracking-wider w-32">{audioCopy.COLUMNS.STATUS}</th>
                           <th className="px-6 py-4 font-normal tracking-wider text-right w-48">{audioCopy.COLUMNS.ACTIONS}</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                         {logs.map(log => (
                           <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                             {editingId === log.id ? (
                               <td colSpan={5} className="p-4">
                                 <form onSubmit={(e) => handleSave(e, log.id)} className="flex items-start gap-4 bg-black/50 p-4 rounded-lg border border-brand-primary/30">
                                   <div className="flex-1 space-y-3">
                                     <input 
                                       name="title" 
                                       defaultValue={log.title} 
                                       className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white text-sm focus:outline-none focus:border-brand-primary"
                                       required
                                     />
                                     <textarea 
                                       name="description" 
                                       defaultValue={log.description} 
                                       rows={2}
                                       className="w-full bg-transparent border-b border-white/10 px-2 py-1 text-white/70 text-xs focus:outline-none focus:border-brand-primary resize-none"
                                       required
                                     />
                                   </div>
                                   <div className="flex flex-col gap-2">
                                     <button type="submit" className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary/20 text-brand-primary hover:bg-brand-primary hover:text-black rounded text-[10px] font-mono uppercase transition-all">
                                       <Save size={14} /> {audioCopy.ACTIONS.SAVE}
                                     </button>
                                     <button type="button" onClick={() => setEditingId(null)} className="flex items-center justify-center gap-2 px-4 py-2 border border-white/10 text-white/50 hover:text-white rounded text-[10px] font-mono uppercase transition-all">
                                       <X size={14} /> {audioCopy.ACTIONS.CANCEL}
                                     </button>
                                   </div>
                                 </form>
                               </td>
                             ) : (
                               <>
                                 <td className="px-6 py-4">
                                   <p className="font-bold text-white mb-1">{log.title}</p>
                                   <p className="text-xs text-white/50 line-clamp-1">{log.description}</p>
                                 </td>
                                 <td className="px-6 py-4 font-mono text-[10px] text-white/70">
                                   {new Date(log.date || log.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                                 </td>
                                 <td className="px-6 py-4 font-mono text-[10px] text-white/70">{log.duration}</td>
                                 <td className="px-6 py-4 font-mono text-[10px]">
                                   {(!log.status || log.status === 'ACTIVE') ? (
                                     <span className="px-2 py-1 rounded bg-brand-primary/10 text-brand-primary border border-brand-primary/20">{audioCopy.STATUS.ACTIVE}</span>
                                   ) : (
                                     <span className="px-2 py-1 rounded bg-white/5 text-white/40 border border-white/10">{audioCopy.STATUS.INACTIVE}</span>
                                   )}
                                 </td>
                                 <td className="px-6 py-4">
                                   <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => handleToggleStatus(log.id, log.status || 'ACTIVE')} className="p-2 text-white/40 hover:text-white transition-colors" title={audioCopy.ACTIONS.TOGGLE_VIS}>
                                       {(!log.status || log.status === 'ACTIVE') ? <Eye size={16} /> : <EyeOff size={16} />}
                                     </button>
                                     <button onClick={() => setEditingId(log.id)} className="p-2 text-white/40 hover:text-brand-primary transition-colors" title={audioCopy.ACTIONS.EDIT}>
                                       <Edit2 size={16} />
                                     </button>
                                     <button onClick={() => handleArchive(log.id)} className="p-2 text-white/40 hover:text-red-400 transition-colors" title={audioCopy.ACTIONS.ARCHIVE}>
                                       <Trash2 size={16} />
                                     </button>
                                   </div>
                                 </td>
                               </>
                             )}
                           </tr>
                         ))}
                       </tbody>
                    </table>
                  )}
               </div>
             )}

             {(activeTab === 'SOCIAL' || activeTab === 'CAMPAIGNS') && (
               <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-50 select-none">
                 {activeTab === 'SOCIAL' ? <Share2 size={48} className="mb-4 text-white/20" /> : <Mail size={48} className="mb-4 text-white/20" />}
                 <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">
                   {activeTab === 'SOCIAL' ? copy.TABS.SOCIAL : copy.TABS.CAMPAIGNS}
                 </h3>
                 <p className="text-xs font-mono text-brand-primary uppercase tracking-widest">
                   {copy.COMING_SOON}
                 </p>
               </div>
             )}

          </div>
       </div>
    </div>
  );
}