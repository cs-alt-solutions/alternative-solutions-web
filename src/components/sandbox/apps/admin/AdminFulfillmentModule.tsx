import React, { useState, useMemo } from 'react';
import { Search, PlayCircle, PauseCircle, RefreshCw, Trash2, Inbox } from 'lucide-react';

export default function AdminFulfillmentModule({ orders, setOrders }: any) {
  const [adminTab, setAdminTab] = useState<'held' | 'pending' | 'picking' | 'ready'>('pending');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = useMemo(() => {
    let list = orders.filter((o: any) => o.status === adminTab || (adminTab === 'ready' && o.status === 'ready_delivery'));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((o: any) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    return list;
  }, [orders, adminTab, searchQuery]);

  const counts = {
    held: orders.filter((o: any) => o.status === 'held').length,
    pending: orders.filter((o: any) => o.status === 'pending').length,
    picking: orders.filter((o: any) => o.status === 'picking').length,
    ready: orders.filter((o: any) => o.status === 'ready_delivery').length,
  };

  const updateStatus = (id: string, status: string) => {
    setOrders((prev: any[]) => prev.map((o: any) => o.id === id ? { ...o, status, assignedTo: status === 'pending' ? null : o.assignedTo } : o));
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <div className="flex bg-zinc-950 p-2 gap-1 border-b border-zinc-800 overflow-x-auto scrollbar-hide shrink-0">
        {[
          { id: 'held', label: 'Incoming', count: counts.held, color: 'text-zinc-500' },
          { id: 'pending', label: 'Queue', count: counts.pending, color: 'text-cyan-400' },
          { id: 'picking', label: 'Active', count: counts.picking, color: 'text-fuchsia-400' },
          { id: 'ready', label: 'Staged', count: counts.ready, color: 'text-emerald-400' }
        ].map((tab: any) => (
          <button 
            key={tab.id} 
            onClick={() => setAdminTab(tab.id)} 
            className={`flex-1 min-w-22.5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${adminTab === tab.id ? `bg-zinc-900 border-zinc-700 ${tab.color} shadow-xl` : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'}`}
          >
            <div className="flex flex-col items-center gap-1">
              <span>{tab.label}</span>
              <span className={`text-xs ${adminTab === tab.id ? tab.color : 'text-zinc-700'}`}>{tab.count}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="p-4 md:p-8 space-y-4">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
          <input type="text" placeholder="Search Matrix..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-zinc-100 focus:border-emerald-500/50 transition-all outline-none" />
        </div>

        {filteredOrders.map((order: any) => (
          <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{order.id}</span>
                <span className="text-[10px] font-black text-cyan-500 uppercase">/ {order.zone}</span>
              </div>
              <h3 className="font-black text-zinc-200 truncate">{order.customer}</h3>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {adminTab === 'held' && <button onClick={() => updateStatus(order.id, 'pending')} className="bg-emerald-600 text-white p-2.5 rounded-xl active:scale-90 shadow-lg"><PlayCircle size={20} /></button>}
              {adminTab === 'pending' && <button onClick={() => updateStatus(order.id, 'held')} className="bg-zinc-800 text-zinc-500 p-2.5 rounded-xl border border-zinc-700"><PauseCircle size={20} /></button>}
              {(adminTab === 'picking' || adminTab === 'ready') && <button onClick={() => updateStatus(order.id, 'pending')} className="bg-zinc-800 text-zinc-500 p-2.5 rounded-xl border border-zinc-700"><RefreshCw size={20} /></button>}
              <button onClick={() => setOrders((prev: any[]) => prev.filter((o: any) => o.id !== order.id))} className="text-zinc-800 hover:text-rose-500 p-2"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
            <Inbox size={48} />
            <p className="font-black uppercase tracking-[.3em] text-xs">Matrix Clear</p>
          </div>
        )}
      </div>
    </div>
  );
}