import React, { useMemo } from 'react';
import { Zap, RefreshCw, TrendingDown, BarChart3, CalendarDays, Loader2 } from 'lucide-react';

const formatCurrency = (val: any) => {
  if (val === null || val === undefined) return '0.00';
  const num = Number(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function MetricsOverview({ metrics, activeCount, enrichedStorefronts, isLoading }: any) {
  const totalSubs = metrics.foundation + metrics.pro || 1;
  const fndStroke = (metrics.foundation / totalSubs) * 100;
  const proStroke = (metrics.pro / totalSubs) * 100;
  const trendBars = [40, 60, 45, 80, 75, 100];

  // 🚀 BULLETPROOF PREDICTIVE MATH (Isolated so it can never crash the parent)
  const upcomingPayments = useMemo(() => {
    if (!enrichedStorefronts || enrichedStorefronts.length === 0) return [];
    
    return enrichedStorefronts
      .filter((s: any) => s.actualPaid > 0)
      .map((s: any) => {
        let safeDate = new Date();
        try {
          if (s.current_period_end) {
            const parsed = typeof s.current_period_end === 'number' && s.current_period_end < 2000000000 
              ? s.current_period_end * 1000 : s.current_period_end;
            safeDate = new Date(parsed);
          } else if (s.created_at) {
            const created = new Date(s.created_at);
            safeDate = new Date(new Date().getFullYear(), new Date().getMonth(), created.getDate());
            if (safeDate < new Date()) safeDate.setMonth(safeDate.getMonth() + 1);
          }
          if (isNaN(safeDate.getTime())) safeDate = new Date(); // Absolute fallback
        } catch {
          safeDate = new Date();
        }
        return { ...s, nextDateObj: safeDate };
      })
      .sort((a: any, b: any) => a.nextDateObj.getTime() - b.nextDateObj.getTime())
      .slice(0, 3)
      .map((s: any) => {
        const diff = s.nextDateObj.getTime() - new Date().getTime();
        const days = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
        let dateStr = s.nextDateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (days === 0) dateStr = 'Today';
        else if (days === 1) dateStr = 'Tomorrow';
        else if (days <= 7) dateStr = `In ${days} days`;

        return { name: s.business_name, amount: formatCurrency(s.actualPaid), dateStr };
      });
  }, [enrichedStorefronts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* ACTIVE PORTALS */}
      <div className="bg-black/40 border border-cyan-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg flex justify-between items-center">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400"><Zap size={16} /></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Portals</span>
          </div>
          <h2 className="text-3xl font-black text-white">{activeCount} <span className="text-sm text-zinc-500 font-medium">Deployed</span></h2>
          <div className="mt-4 flex items-center gap-4 text-[10px] font-mono">
            <div className="text-cyan-400">STD: <span className="text-white">{metrics.foundation}</span></div>
            <div className="text-fuchsia-400">PRO: <span className="text-white">{metrics.pro}</span></div>
          </div>
        </div>
        <div className="relative w-16 h-16 mr-4 shrink-0">
          <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90 rounded-full overflow-visible drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <circle r="15.91549431" cx="16" cy="16" fill="transparent" stroke="#06b6d4" strokeWidth="4" strokeDasharray={`${fndStroke} 100`} />
            <circle r="15.91549431" cx="16" cy="16" fill="transparent" stroke="#d946ef" strokeWidth="4" strokeDasharray={`${proStroke} 100`} strokeDashoffset={-fndStroke} />
          </svg>
        </div>
      </div>

      {/* NET MRR */}
      <div className="bg-black/40 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg flex justify-between items-end">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><BarChart3 size={16} /></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Net MRR</span>
          </div>
          <h2 className="text-3xl font-black text-white">${formatCurrency(metrics.net)}<span className="text-sm text-zinc-500 font-medium">/mo</span></h2>
          <div className="mt-4 flex flex-col text-[10px] font-mono">
            <div className="text-zinc-400">Gross: <span className="text-white">${formatCurrency(metrics.gross)}</span></div>
            {metrics.discount > 0 && <div className="text-rose-400">Discounts: -${formatCurrency(metrics.discount)}</div>}
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-16 opacity-80 pb-2">
          {trendBars.map((height, i) => (
            <div key={i} className={`w-3 rounded-t-sm ${i === trendBars.length - 1 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-zinc-800'}`} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      {/* PREDICTIVE CASHFLOW */}
      <div className="bg-black/40 border border-violet-500/20 rounded-2xl p-6 relative overflow-hidden shadow-lg flex flex-col justify-between">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400"><CalendarDays size={16} /></div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Upcoming Auto-Pays</span>
          </div>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center space-y-2.5">
          {isLoading ? (
            <p className="text-xs text-zinc-500 font-mono flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> Calculating...</p>
          ) : upcomingPayments.length === 0 ? (
            <p className="text-xs text-zinc-500 font-mono italic">No upcoming payments scheduled.</p>
          ) : (
            upcomingPayments.map((pay: any, i: number) => (
              <div key={i} className="flex items-center justify-between border-b border-zinc-800/50 pb-2 last:border-0 last:pb-0">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate max-w-[120px] md:max-w-[180px]">{pay.name}</span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase">{pay.dateStr}</span>
                </div>
                <span className="text-sm font-black text-emerald-400">+${pay.amount}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}