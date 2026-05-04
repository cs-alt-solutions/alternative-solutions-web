/* src/components/sandbox/apps/division/fulfillment/FulfillmentTerminal.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { PackageSearch, LayoutGrid, CheckCircle, MapPin, User, X, QrCode, Lock, PauseCircle, Package } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

interface FulfillmentTerminalProps {
  clientConfig: any;
  onExit: () => void;
  operatorId: string;
}

export default function FulfillmentTerminal({ clientConfig, onExit, operatorId }: FulfillmentTerminalProps) {
  const [view, setView] = useStickyState('dashboard', `ful_view_${clientConfig.id}`); 
  const [orders, setOrders] = useStickyState(clientConfig.fulfillment.initialOrders, `ful_orders_${clientConfig.id}`);
  
  // FIX: Explicitly define type as string | null so TS allows ID assignment
  const [activeOrderId, setActiveOrderId] = useStickyState<string | null>(null, `ful_active_id_${clientConfig.id}`);
  
  const [dashboardTab, setDashboardTab] = useStickyState('active', `ful_tab_${clientConfig.id}`);

  const activeOrder = useMemo(() => orders.find((o: any) => o.id === activeOrderId), [orders, activeOrderId]);

  const filteredOrders = useMemo(() => {
    if (dashboardTab === 'active') return orders.filter((o: any) => o.status === 'pending' || o.status === 'picking');
    return orders.filter((o: any) => o.status === 'ready_delivery');
  }, [orders, dashboardTab]);

  const activePickItem = useMemo(() => {
    if (!activeOrder) return null;
    return activeOrder.items.find((item: any) => item.qtyPicked < item.qtyRequired) || null;
  }, [activeOrder]);

  const handleStartPicking = (orderId: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === orderId && o.status === 'pending' ? { ...o, status: 'picking', assignedTo: operatorId } : o));
    setActiveOrderId(orderId);
    setView('scanner');
  };

  const handleSimulateScan = () => {
    if (!activeOrder || !activePickItem) return;
    setOrders((prevOrders: any[]) => {
      return prevOrders.map(order => {
        if (order.id !== activeOrderId) return order;
        const updatedItems = order.items.map((item: any) => item.id === activePickItem.id ? { ...item, qtyPicked: item.qtyPicked + 1 } : item);
        const isOrderComplete = updatedItems.every((item: any) => item.qtyPicked >= item.qtyRequired);
        return { ...order, items: updatedItems, status: isOrderComplete ? 'ready_delivery' : 'picking' };
      });
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 animate-in fade-in duration-300 min-h-dvh">
      <header className="bg-zinc-900 p-4 border-b border-zinc-800 z-20 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-zinc-800 text-zinc-500 rounded-xl border border-zinc-800 transition-colors">
            <LayoutGrid size={20} />
          </button>
          <div className="flex items-center gap-2">
            <PackageSearch size={24} className="text-fuchsia-400" />
            <h1 className="font-black text-lg tracking-wider uppercase text-zinc-100">Fulfillment</h1>
          </div>
        </div>
      </header>

      {view === 'dashboard' ? (
        <main className="flex-1 flex flex-col max-w-400 mx-auto w-full p-4 overflow-hidden">
          <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800 shadow-inner mb-6 shrink-0">
            <button 
              onClick={() => setDashboardTab('active')} 
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dashboardTab === 'active' ? 'bg-zinc-800 text-amber-400 border border-zinc-700 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Queue
            </button>
            <button 
              onClick={() => setDashboardTab('staged')} 
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${dashboardTab === 'staged' ? 'bg-zinc-800 text-emerald-400 border border-zinc-700 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Staged
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
            {filteredOrders.length === 0 ? (
              <div className="text-center p-12 bg-zinc-900 border border-dashed border-zinc-800 rounded-4xl opacity-50">
                <p className="font-black uppercase text-xs tracking-widest">No Orders in Region</p>
              </div>
            ) : filteredOrders.map((order: any) => {
              const isLocked = order.status === 'picking' && order.assignedTo && order.assignedTo !== operatorId;
              const isHeld = order.status === 'held';
              return (
                <div key={order.id} className={`bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-opacity ${isLocked || isHeld ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="bg-zinc-950/50 px-4 py-2 border-b border-zinc-800 flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>{order.id}</span><span>{order.zone}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-zinc-100 text-lg mb-4">{order.customer}</h3>
                    <button 
                      onClick={() => !isLocked && !isHeld && handleStartPicking(order.id)} 
                      disabled={isLocked || isHeld || order.status.startsWith('ready')}
                      className={`w-full py-4 rounded-xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all ${
                        order.status.startsWith('ready') ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        isHeld ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 
                        isLocked ? 'bg-zinc-950 text-zinc-700 cursor-not-allowed' : 
                        'bg-fuchsia-600 text-white hover:bg-fuchsia-500 active:scale-95 shadow-[0_0_20px_rgba(217,70,239,0.2)]'
                      }`}
                    >
                      {order.status.startsWith('ready') ? <><CheckCircle size={14} /> Staged</> : 
                       isHeld ? <><PauseCircle size={14} /> Held by Admin</> : 
                       isLocked ? <><Lock size={14} /> Locked by {order.assignedTo}</> : 
                       <><Package size={14} /> Claim Order</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      ) : (
        <main className="flex-1 flex flex-col p-4 max-w-400 mx-auto w-full overflow-hidden">
          <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl mb-4 shadow-lg shrink-0">
            <div className="flex items-center gap-3 mb-3 border-b border-zinc-800 pb-3">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800 text-fuchsia-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Active Client</p>
                <p className="font-black text-xl text-zinc-100 leading-none">{activeOrder?.customer}</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-bold flex items-center gap-2 uppercase tracking-wide">
              <MapPin size={14} className="text-zinc-600"/> {activeOrder?.zone}
            </p>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto mb-4 scrollbar-hide">
            {activeOrder?.items.map((item: any) => {
              const isPicked = item.qtyPicked >= item.qtyRequired;
              return (
                <div key={item.id} className={`p-4 rounded-2xl border flex justify-between items-center transition-all ${isPicked ? 'bg-emerald-500/5 border-emerald-500/20 opacity-40' : 'bg-zinc-900 border-zinc-800 shadow-md'}`}>
                   <span className={`font-bold text-sm uppercase tracking-wide ${isPicked ? 'line-through text-zinc-600' : 'text-zinc-200'}`}>
                     {item.name}
                   </span>
                   <span className={`font-black text-xs px-2 py-1 rounded border ${isPicked ? 'border-emerald-500/30 text-emerald-500' : 'border-zinc-700 text-zinc-500'}`}>
                     {item.qtyPicked} / {item.qtyRequired}
                   </span>
                </div>
              );
            })}
          </div>

          {activePickItem ? (
            <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center shadow-2xl shrink-0">
                <p className="text-[10px] font-black uppercase text-fuchsia-400 mb-2 animate-pulse tracking-[0.3em]">Awaiting Valid Scan</p>
                <p className="font-black text-2xl text-white mb-6 uppercase tracking-tight leading-none">{activePickItem.name}</p>
                <button 
                  onClick={handleSimulateScan} 
                  className="w-full bg-fuchsia-600 py-5 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:bg-fuchsia-500 active:scale-95 transition-all"
                >
                  <QrCode size={28} /> Simulate Scan
                </button>
            </div>
          ) : (
            <div className="text-center animate-in zoom-in-95 p-8 bg-zinc-900 rounded-4xl border border-zinc-800 shadow-2xl shrink-0">
              <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h2 className="font-black text-2xl text-zinc-100 uppercase mb-4 tracking-tighter">Manifest Sealed</h2>
              <button 
                onClick={() => { setDashboardTab('staged'); setView('dashboard'); }} 
                className="w-full bg-white py-4 rounded-2xl text-zinc-950 font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
              >
                Back to Queue
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  );
}