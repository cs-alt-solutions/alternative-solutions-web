// sandbox/apps/admin/AdminTerminal.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Shield, Zap, Bell, Lock, KeyRound, UserCircle2, ArrowRight, AlertTriangle, Database } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';
import { supabase } from '@/utils/supabase';

import AdminFulfillmentModule from './AdminFulfillmentModule';
import AdminInventoryModule from './AdminInventoryModule';
import AdminStorefrontModule from './AdminStorefrontModule';
import AdminOperationsModule from './AdminOperationsModule';

export default function AdminTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const cid = clientConfig.id;
  
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [operatorId, setOperatorId] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [authError, setAuthError] = useState('');

  const requiredAdminId = clientConfig?.adminSecurity?.adminId || 'ADMIN-01';
  const requiredPassphrase = clientConfig?.adminSecurity?.passphrase || 'VAULT-ACCESS-99';

  const [activeModule, setActiveModule] = useState<'fulfillment' | 'inventory' | 'storefront' | 'operations'>('inventory'); 
  const [notification, setNotification] = useState<string | null>(null);

  const initialOrders = clientConfig?.fulfillment?.initialOrders || [];
  const [orders, setOrders] = useStickyState(initialOrders, `ful_orders_${cid}`); 
  
  const [stock, setStock] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  // NEW: State bridge to pass items between Storefront and Inventory modules
  const [jumpToEditItem, setJumpToEditItem] = useState<any>(null);

  const handleJumpToInventory = (item: any) => {
    setJumpToEditItem(item);
    setActiveModule('inventory');
  };

  useEffect(() => {
    if (!isAuthorized) return;
    
    const fetchInventory = async () => {
      try {
        const { data, error } = await supabase
          .from('client_inventory')
          .select('payload')
          .eq('client_id', cid);
          
        if (error) throw error;
        if (data) setStock(data.map(row => row.payload));
      } catch (err) {
        console.error("Vault Sync Error:", err);
        setNotification("Failed to sync with master database.");
      } finally {
        setIsSyncing(false);
      }
    };
    
    fetchInventory();
  }, [cid, isAuthorized]);

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
    const mockOrderData = clientConfig?.mockData?.sampleOrder || { customer: "System Test", zone: "Test Zone", items: [] };

    const newOrder = {
      id: newId, customer: mockOrderData.customer, zone: mockOrderData.zone, status: 'held',
      timeReceived: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      items: mockOrderData.items
    };
    
    setOrders((prev: any[]) => [newOrder, ...prev]);
    setNotification(`Order ${newId} Inbound!`);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (operatorId.trim().toUpperCase() === requiredAdminId && passphrase.trim() === requiredPassphrase) {
      setIsAuthorized(true);
    } else {
      setAuthError("INCORRECT CREDENTIALS. ACCESS LOGGED.");
      setPassphrase(''); 
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 relative selection:bg-cyan-500/30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="z-10 w-full max-w-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full" />
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 relative z-10 shadow-2xl">
              <Shield size={40} className="text-cyan-400" />
            </div>
          </div>

          <h1 className="text-2xl font-black tracking-tight mb-1 text-center text-zinc-100 uppercase">{clientConfig.name} <span className="text-cyan-400">Admin</span></h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.3em] mb-10 uppercase text-center flex items-center justify-center gap-2">
            <Lock size={12} className="text-rose-500" /> Client Vault Access
          </p>

          <form onSubmit={handleAdminAuth} className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl shadow-2xl">
            <div className="space-y-4 mb-8">
              <div className="relative">
                <UserCircle2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="text" value={operatorId} onChange={(e) => { setAuthError(""); setOperatorId(e.target.value.toUpperCase()); }} placeholder="ADMIN ID" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm font-black tracking-widest text-cyan-400 outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700" />
              </div>
              <div className="relative">
                <KeyRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input type="password" value={passphrase} onChange={(e) => { setAuthError(""); setPassphrase(e.target.value); }} placeholder="VAULT PASSPHRASE" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-sm font-black tracking-widest text-cyan-400 outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700" />
              </div>
            </div>

            {authError && (
              <div className="mb-6 bg-rose-500/10 border border-rose-500/20 py-3 px-4 rounded-xl flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
                <AlertTriangle size={14} className="text-rose-500 shrink-0" />
                <span className="text-[10px] font-black tracking-widest uppercase text-rose-500">{authError}</span>
              </div>
            )}

            <button type="submit" disabled={!operatorId || !passphrase} className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              Unlock Vault <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {process.env.NEXT_PUBLIC_APP_MODE !== 'PRODUCTION' && (
            <div className="mt-8 flex flex-col items-center gap-1">
               <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-widest">DEV CREDENTIALS</span>
               <span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">ID: {requiredAdminId} | PASS: {requiredPassphrase}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-emerald-400" />
            <div className="hidden sm:flex flex-col">
              <h1 className="font-black text-lg tracking-wider uppercase text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-zinc-100 leading-none">Admin Command</h1>
              <span className="text-[8px] font-black uppercase tracking-widest text-cyan-500 mt-1">Powered by Alternative Solutions</span>
            </div>
          </div>
        </div>
        
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-1">
           <button onClick={() => setActiveModule('storefront')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'storefront' ? 'bg-fuchsia-500/20 text-fuchsia-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Store</button>
           <button onClick={() => setActiveModule('fulfillment')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'fulfillment' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Orders</button>
           <button onClick={() => setActiveModule('inventory')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'inventory' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Inventory</button>
           <button onClick={() => setActiveModule('operations')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'operations' ? 'bg-indigo-500/20 text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'}`}>Ops</button>
        </div>

        <button onClick={simulateNewOrder} className="bg-zinc-800 p-2 rounded-xl text-emerald-400 border border-emerald-900/30 active:scale-95 transition-all hover:bg-emerald-500/10 hidden sm:block"><Zap size={20} /></button>
      </header>

      <main className="flex-1 overflow-y-auto w-full relative">
        {isSyncing ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 animate-in fade-in duration-500">
            <Database size={48} className="mb-4 text-cyan-500/50 animate-pulse" />
            <span className="text-xs font-black tracking-[0.2em] uppercase">Syncing Live Vault...</span>
          </div>
        ) : (
          <>
            {activeModule === 'fulfillment' && <AdminFulfillmentModule orders={orders} setOrders={setOrders} notification={notification} setNotification={setNotification} />}
            {/* FIXED: Wires the jumpToEditItem and clear callback into the Inventory Module */}
            {activeModule === 'inventory' && <AdminInventoryModule stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} clientConfig={clientConfig} jumpToEditItem={jumpToEditItem} clearJumpToEdit={() => setJumpToEditItem(null)} />}
            {activeModule === 'storefront' && <AdminStorefrontModule stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} clientConfig={clientConfig} onJumpToInventory={handleJumpToInventory} />}
            {activeModule === 'operations' && <AdminOperationsModule clientConfig={clientConfig} setNotification={setNotification} />}
          </>
        )}
      </main>
    </div>
  );
}