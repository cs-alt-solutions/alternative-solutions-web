import React, { useEffect, useState } from 'react';
import { History, PackagePlus, Smartphone, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function AuditHistoryLogs({ clientConfig }: any) {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const { data } = await supabase.from('client_settings').select('payload').eq('client_id', clientConfig.id || 'division').single();
        setLogs(data?.payload?.auditLogs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [clientConfig.id]);

  if (isLoading) return <div className="p-8 text-center text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading Ledger...</div>;
  if (logs.length === 0) return <div className="p-8 text-center text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">No History Found</div>;

  return (
    <div className="space-y-4 animate-in fade-in pb-12">
      {logs.map((log: any, idx: number) => {
        const isAudit = log.type === 'AUDIT';
        const dateObj = new Date(log.date);
        const hasNegativeVariance = isAudit && log.details?.some((d: any) => d.variance < 0);

        return (
          <div key={log.id || idx} className={`bg-zinc-900/50 border rounded-2xl p-5 relative overflow-hidden ${isAudit ? (hasNegativeVariance ? 'border-rose-500/30' : 'border-zinc-800') : 'border-emerald-500/30'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 pointer-events-none ${isAudit ? (hasNegativeVariance ? 'bg-rose-500' : 'bg-cyan-500') : 'bg-emerald-500'}`} />

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                   {isAudit ? <Smartphone size={16} className={hasNegativeVariance ? 'text-rose-400' : 'text-cyan-400'} /> : <PackagePlus size={16} className="text-emerald-400" />}
                   <h3 className={`text-sm font-black uppercase tracking-widest ${isAudit ? (hasNegativeVariance ? 'text-rose-400' : 'text-cyan-400') : 'text-emerald-400'}`}>
                     {isAudit ? 'Digital Audit' : 'Receiving Intake'}
                   </h3>
                 </div>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5"><Clock size={12}/> {dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString()}</p>
                 <span className="inline-block mt-2 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-md text-[9px] font-black text-zinc-400 uppercase tracking-widest">Target: {log.category}</span>
              </div>

              <div className="text-left sm:text-right">
                 <span className="block text-2xl font-mono font-black text-zinc-100 leading-none">{isAudit ? log.details?.length || 0 : log.totalItemsTouched}</span>
                 <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{isAudit ? 'Discrepancies Logged' : 'Units Received'}</span>
              </div>
            </div>

            {log.details && log.details.length > 0 && (
              <div className="mt-4 pt-4 border-t border-zinc-800/50 space-y-1.5">
                {log.details.map((detail: any, dIdx: number) => (
                  <div key={dIdx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950/50 p-2 rounded-lg text-[10px] sm:text-xs gap-2">
                     <span className="font-bold text-zinc-300 truncate pr-2">{detail.itemName} <span className="text-zinc-600 font-medium">({detail.variant})</span></span>
                     {isAudit ? (
                       <div className="flex items-center gap-3 shrink-0 font-mono">
                         <span className="text-zinc-500">Sys: {detail.expected}</span>
                         <span className="text-zinc-300">Act: {detail.actual}</span>
                         <span className={`font-black w-8 text-right ${detail.variance < 0 ? 'text-rose-500' : 'text-emerald-400'}`}>{detail.variance > 0 ? `+${detail.variance}` : detail.variance}</span>
                       </div>
                     ) : (
                       <div className="flex items-center gap-2 sm:gap-3 shrink-0 font-mono">
                         <span className="text-zinc-600">Sys: {detail.previous}</span>
                         {detail.counted !== detail.previous && <span className="text-amber-400 font-bold">Act: {detail.counted}</span>}
                         <span className="text-emerald-400 font-black px-1">+{detail.added}</span>
                         <span className="text-zinc-300 font-bold border-l border-zinc-700 pl-2">Tot: {detail.newTotal}</span>
                       </div>
                     )}
                  </div>
                ))}
              </div>
            )}
            
            {isAudit && log.details?.length === 0 && (
               <div className="mt-4 pt-4 border-t border-zinc-800/50 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                  <CheckCircle size={14} /> Perfect Audit. No Discrepancies Found.
               </div>
            )}
          </div>
        );
      })}
    </div>
  );
}