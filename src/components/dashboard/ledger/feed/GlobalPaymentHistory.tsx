/* src/components/dashboard/ledger/feed/GlobalPaymentHistory.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Loader2, Download, Eye, ChevronDown, ChevronUp, Receipt } from 'lucide-react';

interface GlobalPaymentHistoryProps {
  globalInvoices: any[];
  isInvoicesLoading: boolean;
  onViewReceipt: (url: string) => void;
}

const formatCurrency = (val: any) => {
  if (val === null || val === undefined) return '0.00';
  const num = Number(val);
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function GlobalPaymentHistory({ globalInvoices, isInvoicesLoading, onViewReceipt }: GlobalPaymentHistoryProps) {
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'PROMO' | 'FOUNDATION' | 'PRO'>('ALL');
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  const displayHistory = globalInvoices.filter(inv => {
    if (historyFilter === 'PROMO') return parseFloat(inv.amount) < parseFloat(inv.subtotal);
    if (historyFilter === 'FOUNDATION') return inv.lineItem?.toLowerCase().includes('foundation') || inv.lineItem?.toLowerCase().includes('standard');
    if (historyFilter === 'PRO') return inv.lineItem?.toLowerCase().includes('pro') || inv.lineItem?.toLowerCase().includes('professional');
    return true;
  });

  const groupedInvoices = displayHistory.reduce((acc: any, inv: any) => {
    const dateObj = new Date(inv.date || Date.now());
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    
    if (!acc[monthYear]) acc[monthYear] = { invoices: [], total: 0, foundationCount: 0, proCount: 0, timestamp: dateObj.getTime() };
    
    acc[monthYear].invoices.push(inv);
    acc[monthYear].total += (Number(inv.amount) || 0);
    
    if (inv.lineItem?.toLowerCase().includes('pro') || inv.lineItem?.toLowerCase().includes('professional')) {
      acc[monthYear].proCount++;
    } else {
      acc[monthYear].foundationCount++;
    }
    
    return acc;
  }, {});

  // 🚀 DESCENDING ORDER: Ensures the most recent month is always at the top
  const sortedMonths = useMemo(() => {
    return Object.entries(groupedInvoices).sort((a: any, b: any) => b[1].timestamp - a[1].timestamp);
  }, [groupedInvoices]);

  // 🚀 AUTO-EXPAND: Instantly opens the most recent month so you don't have to click
  useEffect(() => {
    if (sortedMonths.length > 0 && !expandedMonth) {
      setExpandedMonth(sortedMonths[0][0]);
    }
  }, [sortedMonths, expandedMonth]);

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-100">
      
      {/* HEADER & FILTERS */}
      <div className="p-5 border-b border-zinc-800/80 bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Receipt size={16} className="text-cyan-500" />
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Global Payment History</h3>
        </div>
        <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800/80">
          <button onClick={() => setHistoryFilter('ALL')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer ${historyFilter === 'ALL' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}>All</button>
          <button onClick={() => setHistoryFilter('PROMO')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer ${historyFilter === 'PROMO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-md' : 'text-zinc-500 hover:text-amber-400'}`}>Promos</button>
          <button onClick={() => setHistoryFilter('FOUNDATION')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer ${historyFilter === 'FOUNDATION' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-zinc-500 hover:text-cyan-400'}`}>Standard</button>
          <button onClick={() => setHistoryFilter('PRO')} className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer ${historyFilter === 'PRO' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 shadow-md' : 'text-zinc-500 hover:text-fuchsia-400'}`}>Pro</button>
        </div>
      </div>

      {/* THE MONTHLY ACCORDION FEED */}
      <div className="flex-1 p-5 space-y-3 overflow-y-auto custom-scrollbar">
        {isInvoicesLoading ? (
          <div className="py-12 flex flex-col items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin text-cyan-500 mb-3" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Compiling Monthly Ledger...</span>
          </div>
        ) : sortedMonths.length === 0 ? (
          <div className="py-12 text-center h-full flex items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
            No payment history found matching this filter.
          </div>
        ) : (
          sortedMonths.map(([month, data]: [string, any]) => {
            const isExpanded = expandedMonth === month;

            return (
              <div key={month} className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setExpandedMonth(isExpanded ? null : month)}
                  className="w-full flex items-center justify-between p-4 bg-zinc-900/80 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronUp size={16} className="text-cyan-400" /> : <ChevronDown size={16} className="text-zinc-500" />}
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{month}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex gap-2">
                      <span className="text-[9px] font-mono text-cyan-500 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">{data.foundationCount} STD</span>
                      <span className="text-[9px] font-mono text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/20">{data.proCount} PRO</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Cleared:</span>
                      <span className="text-sm font-black text-emerald-400">${formatCurrency(data.total)}</span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="bg-black/20 border-t border-zinc-800/50">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                      <tbody className="divide-y divide-zinc-800/50">
                        {data.invoices.map((invoice: any) => (
                          <tr key={invoice.id} className="hover:bg-zinc-900/50 transition-colors group">
                            <td className="px-4 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-bold text-white truncate max-w-50 md:max-w-75">{invoice.storefrontName}</span>
                                <span className="text-[10px] font-mono text-zinc-500 truncate max-w-50 md:max-w-75">{invoice.customerName} ({invoice.customerEmail})</span>
                                <span className="text-[9px] font-mono text-zinc-600 mt-1">{invoice.date}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right">
                              {parseFloat(invoice.amount) < parseFloat(invoice.subtotal) ? (
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-sm text-emerald-400 font-bold">${formatCurrency(invoice.amount)}</span>
                                  <span className="text-[9px] font-mono text-rose-400/80 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 line-through">
                                    ${formatCurrency(invoice.subtotal)}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-emerald-400 font-bold">${formatCurrency(invoice.amount)}</span>
                              )}
                            </td>
                            <td className="px-4 py-4 text-center">
                              <div className="flex items-center justify-center gap-2 opacity-100 md:opacity-60 md:group-hover:opacity-100 transition-opacity">
                                {invoice.hostedUrl && (
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); onViewReceipt(invoice.hostedUrl); }}
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
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors border border-zinc-700 cursor-pointer"
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
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}