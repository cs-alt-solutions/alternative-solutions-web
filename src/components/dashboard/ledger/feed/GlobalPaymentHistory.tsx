/* src/components/dashboard/ledger/feed/GlobalPaymentHistory.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { Receipt, Loader2, Download, Eye, Target, TrendingUp } from 'lucide-react';

interface GlobalPaymentHistoryProps {
  globalInvoices: any[];
  isInvoicesLoading: boolean;
  onViewReceipt: (url: string) => void;
}

export default function GlobalPaymentHistory({ globalInvoices, isInvoicesLoading, onViewReceipt }: GlobalPaymentHistoryProps) {
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'PROMO' | 'FOUNDATION' | 'PRO'>('ALL');
  const [monthlyGoal, setMonthlyGoal] = useState(50); // Interactive Goal Line

  const displayHistory = globalInvoices.filter(inv => {
    if (historyFilter === 'PROMO') return parseFloat(inv.amount) < parseFloat(inv.subtotal);
    if (historyFilter === 'FOUNDATION') return inv.lineItem?.toLowerCase().includes('foundation');
    if (historyFilter === 'PRO') return inv.lineItem?.toLowerCase().includes('pro') || inv.lineItem?.toLowerCase().includes('professional');
    return true;
  });

  // Group invoices by month for the feed
  const groupedInvoices = displayHistory.reduce((acc: any, inv: any) => {
    const dateObj = new Date(inv.date);
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) acc[monthYear] = { invoices: [], total: 0, foundationCount: 0, proCount: 0, timestamp: dateObj.getTime() };
    
    acc[monthYear].invoices.push(inv);
    acc[monthYear].total += parseFloat(inv.amount);
    
    if (inv.lineItem?.toLowerCase().includes('pro') || inv.lineItem?.toLowerCase().includes('professional')) {
      acc[monthYear].proCount++;
    } else {
      acc[monthYear].foundationCount++;
    }
    
    return acc;
  }, {});

  // Prepare chronological data for the SVG Chart
  const chartData = useMemo(() => {
    return Object.entries(groupedInvoices)
      .map(([month, data]: any) => ({
        month,
        total: data.invoices.length,
        foundation: data.foundationCount,
        pro: data.proCount,
        timestamp: data.timestamp
      }))
      .sort((a, b) => a.timestamp - b.timestamp); // Chronological: Left to Right
  }, [groupedInvoices]);

  // SVG Chart Math
  const chartHeight = 160;
  const maxDataPoint = Math.max(...chartData.map(d => d.total), monthlyGoal, 10); // Ensure scale never breaks
  const scaleY = (val: number) => chartHeight - (val / maxDataPoint) * chartHeight;
  const stepX = chartData.length > 1 ? 100 / (chartData.length - 1) : 100;

  const generatePath = (key: 'total' | 'foundation' | 'pro') => {
    if (chartData.length === 0) return '';
    return chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * stepX} ${scaleY(d[key])}`).join(' ');
  };

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-100">
      
      {/* HEADER & FILTERS */}
      <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col gap-4 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrendingUp size={16} className="text-cyan-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Growth Telemetry</h3>
          </div>
          <div className="flex items-center gap-2">
            <Target size={12} className="text-amber-500" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Goal:</span>
            <input 
              type="number" 
              value={monthlyGoal} 
              onChange={(e) => setMonthlyGoal(Number(e.target.value))}
              className="bg-zinc-950 border border-amber-500/30 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded w-16 text-center outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 🚀 THE SVG PROJECTION CHART */}
        {!isInvoicesLoading && chartData.length > 0 && (
          <div className="relative w-full h-40 my-2 bg-black/40 border border-white/5 rounded-xl p-4 overflow-visible">
            
            {/* Y-Axis Labels */}
            <div className="absolute left-2 top-2 bottom-6 flex flex-col justify-between text-[8px] font-mono text-zinc-600">
              <span>{maxDataPoint}</span>
              <span>{Math.round(maxDataPoint / 2)}</span>
              <span>0</span>
            </div>

            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 160">
              {/* Goal Line */}
              <line x1="0" y1={scaleY(monthlyGoal)} x2="100" y2={scaleY(monthlyGoal)} stroke="#f59e0b" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />
              
              {/* Foundation Line (Cyan) */}
              <path d={generatePath('foundation')} fill="none" stroke="#06b6d4" strokeWidth="1.5" className="drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]" />
              {/* Pro Line (Fuchsia) */}
              <path d={generatePath('pro')} fill="none" stroke="#d946ef" strokeWidth="1.5" className="drop-shadow-[0_0_5px_rgba(217,70,239,0.5)]" />
              
              {/* Data Points */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={i * stepX} cy={scaleY(d.foundation)} r="1.5" fill="#06b6d4" />
                  <circle cx={i * stepX} cy={scaleY(d.pro)} r="1.5" fill="#d946ef" />
                </g>
              ))}
            </svg>

            {/* X-Axis Labels */}
            <div className="absolute bottom-1 left-4 right-4 flex justify-between">
              {chartData.map((d, i) => (
                <span key={i} className="text-[8px] font-mono text-zinc-500 uppercase -ml-2" style={{ position: 'absolute', left: `${i * stepX}%` }}>
                  {d.month.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Legend & Filter Tabs */}
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mt-2">
          <button onClick={() => setHistoryFilter('ALL')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'ALL' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>All</button>
          <button onClick={() => setHistoryFilter('PROMO')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'PROMO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-md' : 'text-zinc-500 hover:text-amber-400'}`}>Promos</button>
          <button onClick={() => setHistoryFilter('FOUNDATION')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'FOUNDATION' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-zinc-500 hover:text-cyan-400'}`}>
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block mr-1" /> Found.
          </button>
          <button onClick={() => setHistoryFilter('PRO')} className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'PRO' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 shadow-md' : 'text-zinc-500 hover:text-fuchsia-400'}`}>
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 inline-block mr-1" /> Pro
          </button>
        </div>
      </div>
      
      {/* THE MONTHLY MATRIX FEED */}
      <div className="overflow-x-auto flex-1 p-4 space-y-8 custom-scrollbar">
        {isInvoicesLoading ? (
          <div className="py-12 flex flex-col items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-cyan-500 mb-3" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Compiling Monthly Ledger...</span>
          </div>
        ) : displayHistory.length === 0 ? (
          <div className="py-12 text-center h-full flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
            No payment history found matching this filter.
          </div>
        ) : (
          // Reverse chronologically so the newest month is at the top of the feed list
          Object.entries(groupedInvoices).reverse().map(([month, data]: [string, any]) => (
            <div key={month} className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{month}</h4>
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{data.foundationCount} FND</span>
                    <span className="text-[9px] font-mono text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">{data.proCount} PRO</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Cleared:</span>
                    <span className="text-xs font-black text-emerald-400">${data.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-white/5 overflow-hidden bg-black/20">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <tbody className="divide-y divide-white/5">
                    {data.invoices.map((invoice: any) => (
                      <tr key={invoice.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-white truncate max-w-37.5">{invoice.storefrontName}</span>
                            <span className="text-[10px] font-mono text-slate-500 truncate max-w-37.5">{invoice.customerName} ({invoice.customerEmail})</span>
                            <span className="text-[9px] font-mono text-zinc-600 mt-1">{invoice.date}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          {parseFloat(invoice.amount) < parseFloat(invoice.subtotal) ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-sm text-emerald-400 font-bold">${invoice.amount}</span>
                              <span className="text-[9px] font-mono text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 line-through">
                                ${invoice.subtotal}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-emerald-400 font-bold">${invoice.amount}</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity">
                            {invoice.hostedUrl && (
                              <button 
                                onClick={() => onViewReceipt(invoice.hostedUrl)}
                                className="p-2 bg-cyan-500/10 text-cyan-400 hover:text-white hover:bg-cyan-500 rounded-lg transition-colors border border-cyan-500/20 cursor-pointer" 
                                title="View Web Invoice"
                              >
                                <Eye size={14} />
                              </button>
                            )}
                            {invoice.pdfUrl && (
                              <a 
                                href={invoice.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700" 
                                title="Download PDF Receipt"
                              >
                                <Download size={14} />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}