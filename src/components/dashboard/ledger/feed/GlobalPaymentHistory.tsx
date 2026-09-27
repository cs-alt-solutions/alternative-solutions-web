/* src/components/dashboard/ledger/feed/GlobalPaymentHistory.tsx */
'use client';

import React, { useState } from 'react';
import { Receipt, Loader2, Download, Eye } from 'lucide-react';

interface GlobalPaymentHistoryProps {
  globalInvoices: any[];
  isInvoicesLoading: boolean;
  onViewReceipt: (url: string) => void;
}

export default function GlobalPaymentHistory({ globalInvoices, isInvoicesLoading, onViewReceipt }: GlobalPaymentHistoryProps) {
  const [historyFilter, setHistoryFilter] = useState<'ALL' | 'PROMO' | 'FOUNDATION' | 'PRO'>('ALL');

  // 1. Filter the invoices based on the active tab
  const displayHistory = globalInvoices.filter(inv => {
    if (historyFilter === 'PROMO') return parseFloat(inv.amount) < parseFloat(inv.subtotal);
    if (historyFilter === 'FOUNDATION') return inv.lineItem.toLowerCase().includes('foundation');
    if (historyFilter === 'PRO') return inv.lineItem.toLowerCase().includes('pro') || inv.lineItem.toLowerCase().includes('professional');
    return true;
  });

  // 2. Group the filtered invoices by Month/Year
  const groupedInvoices = displayHistory.reduce((acc: any, inv: any) => {
    const dateObj = new Date(inv.date);
    const monthYear = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    
    if (!acc[monthYear]) acc[monthYear] = { invoices: [], total: 0 };
    acc[monthYear].invoices.push(inv);
    acc[monthYear].total += parseFloat(inv.amount);
    
    return acc;
  }, {});

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col min-h-100">
      
      {/* HEADER & FILTERS */}
      <div className="p-4 border-b border-white/5 bg-black/20 flex flex-col gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Receipt size={16} className="text-cyan-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-widest">
            Global Feed
          </h3>
        </div>
        
        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
          <button 
            onClick={() => setHistoryFilter('ALL')}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'ALL' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setHistoryFilter('PROMO')}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'PROMO' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20 shadow-md' : 'text-zinc-500 hover:text-amber-400'}`}
          >
            Promos
          </button>
          <button 
            onClick={() => setHistoryFilter('FOUNDATION')}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'FOUNDATION' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 shadow-md' : 'text-zinc-500 hover:text-cyan-400'}`}
          >
            Found.
          </button>
          <button 
            onClick={() => setHistoryFilter('PRO')}
            className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-widest rounded transition-all cursor-pointer flex items-center justify-center gap-1.5 ${historyFilter === 'PRO' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20 shadow-md' : 'text-zinc-500 hover:text-fuchsia-400'}`}
          >
            Pro
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
          Object.entries(groupedInvoices).map(([month, data]: [string, any]) => (
            <div key={month} className="space-y-3 animate-in fade-in slide-in-from-bottom-4">
              
              {/* MONTHLY BLOCK HEADER */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">{month}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Cleared:</span>
                  <span className="text-xs font-black text-emerald-400">${data.total.toFixed(2)}</span>
                </div>
              </div>

              {/* MONTHLY INVOICE LIST */}
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
                          <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
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