/* src/components/sandbox/apps/admin/AdminTerminal.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Zap, Bell, LayoutGrid, Search, Activity, 
  PlayCircle, PauseCircle, RefreshCw, Trash2, 
  Inbox, Clock, Globe, CheckCircle, Package, 
  AlertTriangle, TrendingDown, BarChart3 
} from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

interface AdminTerminalProps {
  clientConfig: any;
  onExit: () => void;
}

export default function AdminTerminal({ clientConfig, onExit }: AdminTerminalProps) {
  const cid = clientConfig.id;
  
  // State 1: Orders (Fulfillment Data)
  const initialOrders = clientConfig?.fulfillment?.initialOrders || [];
  const [orders, setOrders] = useStickyState(initialOrders, `ful_orders_${cid}`); 
  
  // State 2: Inventory (Stock Data)
  const initialStock = clientConfig?.inventory || [];
  const [stock, setStock] = useStickyState(initialStock, `inv_stock_${cid}`);

  const [adminTab, setAdminTab] = useState<'held' | 'pending' | 'picking' | 'ready' | 'stock'>('pending');
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ==========================================
  // LOGIC: INVENTORY INTELLIGENCE
  // ==========================================
  const inventoryMatrix = useMemo(() => {
    return stock.map((item: any) => {
      // Calculate Committed: Sum of qty in all orders that aren't 'ready_delivery' (staged) yet
      const committed = orders.reduce((sum: number, order: any) => {
        if (order.status === 'ready_delivery') return sum; 
        const orderItem = order.items.find((i: any) => i.id === item.id || i.name === item.name);
        return sum + (orderItem ? orderItem.qtyRequired : 0);
      }, 0);

      const available = item.onHand - committed;
      return { ...item, committed, available };
    });
  }, [stock, orders]);

  // ==========================================
  // LOGIC: ORDER FILTERING
  // ==========================================
  const filteredOrders = useMemo(() => {
    let list = orders.filter((o: any) => {
      if (adminTab === 'held') return o.status === 'held';
      if (adminTab === 'pending') return o.status === 'pending';
      if (adminTab === 'picking') return o.status === 'picking';
      if (adminTab === 'ready') return o.status === 'ready_delivery';
      return false;
    });

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((o: any) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q));
    }
    return list;
  }, [orders, adminTab, searchQuery]);

  const counts = useMemo(() => ({
    held: orders.filter((o: any) => o.status === 'held').length,
    pending: orders.filter((o: any) => o.status === 'pending').length,
    picking: orders.filter((o: any) => o.status === 'picking').length,
    ready: orders.filter((o: any) => o.status === 'ready_delivery').length,
    lowStock: inventoryMatrix.filter((i: any) => i.available <= 5).length
  }), [orders, inventoryMatrix]);

  const updateStatus = (id: string, status: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === id ? { ...o, status, assignedTo: status === 'pending' ? null : o.assignedTo } : o));
  };

  const simulateNewOrder = () => {
    const newId = `ECOM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId,
      customer: "New Web Order",
      zone: "Williamsburg",
      status: 'held',
      timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [{ id: 'itm-1', name: 'Premium Sample', qtyRequired: 2, qtyPicked: 0 }]
    };
    setOrders((prev: any[]) => [newOrder, ...prev]);
    setNotification(`Order ${newId} Inbound!`);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 animate-in fade-in duration-300 min-h-dvh">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-emerald-500 text-zinc-950 p-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-in slide-in-from-top-8">
          <Bell size={20} className="animate-bounce" />
          <span className="uppercase tracking-widest text-sm">{notification}</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-zinc-900 p-4 md:px-8 flex items-center justify-between border-b border-zinc-800 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl border border-zinc-800 transition-colors">
            <LayoutGrid size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-emerald-400" />
            <h1 className="font-black text-lg tracking-wider uppercase text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-zinc-100">Admin Command</h1>
          </div>
        </div>
        <button onClick={simulateNewOrder} className="bg-zinc-800 p-2 rounded-xl text-emerald-400 border border-emerald-900/30 active:scale-95 transition-all hover:bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
          <Zap size={20} />
        </button>
      </header>

      {/* Control Matrix Tabs */}
      <div className="flex bg-zinc-950 p-2 gap-1 border-b border-zinc-800 overflow-x-auto scrollbar-hide shrink-0">
        {[
          { id: 'held', label: 'Incoming', count: counts.held, color: 'text-zinc-500' },
          { id: 'pending', label: 'Queue', count: counts.pending, color: 'text-cyan-400' },
          { id: 'picking', label: 'Active', count: counts.picking, color: 'text-fuchsia-400' },
          { id: 'ready', label: 'Staged', count: counts.ready, color: 'text-emerald-400' },
          { id: 'stock', label: 'Stock', count: counts.lowStock, color: 'text-amber-400', icon: Package }
        ].map((tab: any) => (
          <button 
            key={tab.id} 
            onClick={() => setAdminTab(tab.id)} 
            className={`flex-1 min-w-[90px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${adminTab === tab.id ? `bg-zinc-900 border-zinc-700 ${tab.color} shadow-xl` : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'}`}
          >
            <div className="flex flex-col items-center gap-1">
              {tab.icon && <tab.icon size={12} />}
              <span>{tab.label}</span>
              <span className={`text-xs ${adminTab === tab.id ? tab.color : 'text-zinc-700'}`}>{tab.count}</span>
            </div>
          </button>
        ))}
      </div>

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full max-w-400 mx-auto">
        
        {/* VIEW: ORDER MANAGEMENT */}
        {adminTab !== 'stock' && (
          <div className="animate-in fade-in duration-300">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
              <input type="text" placeholder="Search Matrix..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-zinc-100 focus:border-emerald-500/50 transition-all outline-none" />
            </div>

            <div className="space-y-3">
              {filteredOrders.map((order: any) => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{order.id}</span>
                      <span className="text-[10px] font-black text-cyan-500 uppercase">/ {order.zone}</span>
                    </div>
                    <h3 className="font-black text-zinc-200 truncate">{order.customer}</h3>
                    {order.assignedTo && <p className="text-[10px] font-bold text-fuchsia-500 uppercase mt-1 flex items-center gap-1"><Activity size={10} className="animate-pulse"/> Picking: {order.assignedTo}</p>}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {adminTab === 'held' && <button onClick={() => updateStatus(order.id, 'pending')} className="bg-emerald-600 text-white p-2.5 rounded-xl active:scale-90 shadow-lg transition-transform"><PlayCircle size={20} /></button>}
                    {adminTab === 'pending' && <button onClick={() => updateStatus(order.id, 'held')} className="bg-zinc-800 text-zinc-500 p-2.5 rounded-xl border border-zinc-700 active:scale-90 transition-transform"><PauseCircle size={20} /></button>}
                    {(adminTab === 'picking' || adminTab === 'ready') && <button onClick={() => updateStatus(order.id, 'pending')} className="bg-zinc-800 text-zinc-500 p-2.5 rounded-xl border border-zinc-700 active:scale-90 transition-transform"><RefreshCw size={20} /></button>}
                    <button onClick={() => setOrders((prev: any[]) => prev.filter(o => o.id !== order.id))} className="text-zinc-800 hover:text-rose-500 p-2 transition-colors"><Trash2 size={18} /></button>
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
        )}

        {/* VIEW: STOCK TELEMETRY */}
        {adminTab === 'stock' && (
          <div className="animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-8">
               <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-amber-400">
                  <BarChart3 size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">Inventory Intelligence</h2>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Real-Time Global Commitment Mapping</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventoryMatrix.map((item: any) => {
                const isOver = item.available < 0;
                const isLow = item.available <= 5 && item.available >= 0;

                return (
                  <div key={item.id} className={`bg-zinc-900 border rounded-3xl p-6 transition-all ${isOver ? 'border-rose-500/50 bg-rose-500/5' : isLow ? 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-zinc-800'}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{item.category}</p>
                        <h3 className="text-lg font-black text-white uppercase leading-none">{item.name}</h3>
                      </div>
                      {isOver && <AlertTriangle className="text-rose-500 animate-pulse" size={20} />}
                      {isLow && !isOver && <Package className="text-amber-500" size={20} />}
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800/50">
                        <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">On Hand</p>
                        <p className="text-xl font-black text-white">{item.onHand}</p>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-3 border border-zinc-800/50">
                        <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Committed</p>
                        <p className="text-xl font-black text-fuchsia-500">{item.committed}</p>
                      </div>
                      <div className={`rounded-2xl p-3 border ${isOver ? 'bg-rose-500/20 border-rose-500/30' : 'bg-black/40 border-zinc-800/50'}`}>
                        <p className="text-[9px] font-black text-zinc-600 uppercase mb-1">Available</p>
                        <p className={`text-xl font-black ${isOver ? 'text-rose-500' : isLow ? 'text-amber-500' : 'text-emerald-500'}`}>
                          {item.available}
                        </p>
                      </div>
                    </div>

                    {isOver && (
                      <div className="mt-4 flex items-center gap-2 text-rose-500 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20 animate-pulse">
                        <TrendingDown size={14} />
                        <p className="text-[10px] font-black uppercase tracking-widest">Inventory Shortage: {Math.abs(item.available)} Units Needed</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}