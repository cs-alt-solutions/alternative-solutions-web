'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Zap, Bell, LayoutGrid } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

import AdminFulfillmentModule from './AdminFulfillmentModule';
import AdminInventoryModule from './AdminInventoryModule';
import AdminStorefrontModule from './AdminStorefrontModule';

export default function AdminTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const cid = clientConfig.id;
  // Set default to storefront
  const [activeModule, setActiveModule] = useState<'fulfillment' | 'inventory' | 'storefront'>('storefront'); 
  const [notification, setNotification] = useState<string | null>(null);

  const initialOrders = clientConfig?.fulfillment?.initialOrders || [];
  const [orders, setOrders] = useStickyState(initialOrders, `ful_orders_${cid}`); 
  const initialStock = clientConfig?.inventory || [];
  const [stock, setStock] = useStickyState(initialStock, `inv_stock_${cid}`);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const inventoryMatrix = useMemo(() => {
    return stock.map((item: any) => {
      const committed = orders.reduce((sum: number, order: any) => {
        if (order.status === 'ready_delivery') return sum; 
        const orderItem = order.items?.find((i: any) => i.id === item.id || i.name === item.name);
        return sum + (orderItem ? orderItem.qtyRequired : 0);
      }, 0);
      const available = item.onHand - committed;
      return { ...item, committed, available };
    });
  }, [stock, orders]);

  const simulateNewOrder = () => {
    const newId = `ECOM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newId, customer: "New Web Order", zone: "Williamsburg", status: 'held',
      timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: [{ id: 'itm-1', name: 'Premium Sample', qtyRequired: 2, qtyPicked: 0 }]
    };
    setOrders((prev: any[]) => [newOrder, ...prev]);
    setNotification(`Order ${newId} Inbound!`);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 animate-in fade-in duration-300 min-h-dvh">
      {notification && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-emerald-500 text-zinc-950 p-4 rounded-2xl font-black flex items-center gap-3 animate-in slide-in-from-top-8">
          <Bell size={20} className="animate-bounce" />
          <span className="uppercase tracking-widest text-sm">{notification}</span>
        </div>
      )}

      <header className="bg-zinc-900 p-4 md:px-8 flex items-center justify-between border-b border-zinc-800 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl border border-zinc-800">
            <LayoutGrid size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-emerald-400" />
            <h1 className="font-black text-lg tracking-wider uppercase text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-zinc-100 hidden sm:block">Admin Command</h1>
          </div>
        </div>
        
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-1">
           {/* Storefront moved to the primary slot */}
           <button onClick={() => setActiveModule('storefront')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'storefront' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-zinc-500'}`}>
             Store
           </button>
           <button onClick={() => setActiveModule('fulfillment')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'fulfillment' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500'}`}>
             Orders
           </button>
           <button onClick={() => setActiveModule('inventory')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'inventory' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500'}`}>
             Inventory
           </button>
        </div>

        <button onClick={simulateNewOrder} className="bg-zinc-800 p-2 rounded-xl text-emerald-400 border border-emerald-900/30 active:scale-95 transition-all hover:bg-emerald-500/10 hidden sm:block">
          <Zap size={20} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto">
        {activeModule === 'fulfillment' && <AdminFulfillmentModule orders={orders} setOrders={setOrders} notification={notification} setNotification={setNotification} />}
        {activeModule === 'inventory' && <AdminInventoryModule stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} clientConfig={clientConfig} />}
        {activeModule === 'storefront' && <AdminStorefrontModule stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} clientConfig={clientConfig} />}
      </main>
    </div>
  );
}