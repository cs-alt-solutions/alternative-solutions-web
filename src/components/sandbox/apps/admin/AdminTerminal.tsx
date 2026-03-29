/* src/components/sandbox/apps/admin/AdminTerminal.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shield, Zap, Bell, LayoutGrid, Search, Activity, 
  PlayCircle, PauseCircle, RefreshCw, Trash2, 
  Inbox, Package, AlertTriangle, TrendingDown, 
  BarChart3, Flame, Store, Boxes, Truck, Edit3, X, Save,
  CheckCircle 
} from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

// ==========================================
// COMPONENT 1: FULFILLMENT MODULE
// ==========================================
const FulfillmentView = ({ orders, setOrders, notification, setNotification }: any) => {
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
            className={`flex-1 min-w-[90px] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border transition-all ${adminTab === tab.id ? `bg-zinc-900 border-zinc-700 ${tab.color} shadow-xl` : 'bg-transparent border-transparent text-zinc-600 hover:text-zinc-400'}`}
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
};

// ==========================================
// COMPONENT 2: INVENTORY EDITOR MODULE (MVP Edit & Add)
// ==========================================
const InventoryView = ({ stock, setStock, inventoryMatrix, setNotification }: any) => {
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Helper to generate a fresh item payload
  const getBlankItem = () => ({
    id: `itm-${Math.random().toString(36).substr(2, 9)}`,
    name: '',
    category: 'Flower', // Default category
    price: 0,
    onHand: 0,
    featured: false,
    dailyDeal: false,
    iconName: 'Leaf', // Default icon
    // For MVP, we will store variants as a comma-separated string to make it easy to type, 
    // and parse it into the format the Storefront expects when saving.
    _tempVariants: '' 
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process the variants string into the array format the Storefront needs
    let finalOptions = [{ id: 'std', label: 'Standard' }];
    if (editingItem._tempVariants && editingItem._tempVariants.trim() !== '') {
      finalOptions = editingItem._tempVariants.split(',').map((v: string) => ({
        id: v.trim().toLowerCase().replace(/\s+/g, '-'),
        label: v.trim()
      }));
    }

    const itemToSave = {
      ...editingItem,
      options: finalOptions,
      sizes: [{ id: 'std', label: 'Standard', price: editingItem.price }] // Default size/price mapping
    };

    if (isAdding) {
      setStock((prev: any[]) => [itemToSave, ...prev]);
      setNotification(`Added to Vault: ${itemToSave.name}`);
    } else {
      setStock((prev: any[]) => prev.map(item => item.id === itemToSave.id ? itemToSave : item));
      setNotification(`Updated Database: ${itemToSave.name}`);
    }
    
    setEditingItem(null);
    setIsAdding(false);
  };

  const openEditor = (item?: any) => {
    if (item) {
      // Map existing options back to a comma-separated string for easy editing
      const tempVariants = item.options?.map((o: any) => o.label).join(', ') || '';
      setEditingItem({ ...item, _tempVariants: tempVariants === 'Standard' ? '' : tempVariants });
      setIsAdding(false);
    } else {
      setEditingItem(getBlankItem());
      setIsAdding(true);
    }
  };

  if (editingItem) {
    return (
      <div className="p-4 md:p-8 animate-in slide-in-from-right-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Edit3 size={20} className="text-emerald-400"/> 
            {isAdding ? 'Add New Product' : 'Edit Database Entry'}
          </h2>
          <button onClick={() => { setEditingItem(null); setIsAdding(false); }} className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-rose-400"><X size={20}/></button>
        </div>
        
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Product Name</label>
              <input type="text" value={editingItem.name} onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} placeholder="e.g., Premium Live Resin Cart" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Category</label>
              <select value={editingItem.category} onChange={(e) => setEditingItem({...editingItem, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50 appearance-none">
                <option value="Flower">Flower</option>
                <option value="Vapes & Carts">Vapes & Carts</option>
                <option value="Edibles">Edibles</option>
                <option value="Concentrates">Concentrates</option>
                <option value="Pre-Rolls">Pre-Rolls</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Strains / Flavors (Comma Separated)</label>
            <input type="text" value={editingItem._tempVariants} onChange={(e) => setEditingItem({...editingItem, _tempVariants: e.target.value})} placeholder="e.g., Sour Diesel, Blue Dream, Granddaddy Purp" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50" />
            <p className="text-[9px] text-zinc-500 mt-2 font-mono uppercase">Leave blank for standard single-item products.</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4 mt-4">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Base Price ($)</label>
              <input type="number" step="0.01" value={editingItem.price || ''} onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50" required />
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Stock On Hand</label>
              <input type="number" value={editingItem.onHand || ''} onChange={(e) => setEditingItem({...editingItem, onHand: parseInt(e.target.value) || 0})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white font-bold outline-none focus:border-emerald-500/50" required />
            </div>
          </div>
          
          <button type="submit" className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
            <Save size={18} /> {isAdding ? 'Inject into Vault' : 'Commit Changes'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 p-3 rounded-2xl border border-amber-500/30 text-amber-400"><Boxes size={24} /></div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Master Vault</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Device-Secured Inventory</p>
          </div>
        </div>
        <button 
          onClick={() => openEditor()} 
          className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-2 px-4 rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(52,211,153,0.1)]"
        >
          + Add Product
        </button>
      </div>

      <div className="space-y-3">
        {inventoryMatrix.map((item: any) => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-all">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{item.category}</p>
                {item.options && item.options.length > 1 && item.options[0].id !== 'std' && (
                  <span className="bg-zinc-800 text-zinc-400 text-[8px] uppercase tracking-widest px-1.5 py-0.5 rounded-sm">
                    {item.options.length} Strains
                  </span>
                )}
              </div>
              <h3 className="font-black text-zinc-100">{item.name}</h3>
              <p className="text-xs text-zinc-400 font-mono mt-1">${item.price?.toFixed(2) || '0.00'} | Stock: {item.onHand}</p>
            </div>
            <button onClick={() => openEditor(item)} className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-400 hover:text-emerald-400 transition-colors">
              <Edit3 size={18} />
            </button>
          </div>
        ))}
        {inventoryMatrix.length === 0 && (
          <div className="text-center py-20 opacity-30 border border-dashed border-zinc-800 rounded-3xl">
            <p className="font-black uppercase tracking-widest text-xs mb-2">Vault is Empty</p>
            <p className="text-[10px] uppercase font-mono">Add products to populate the storefront.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 3: STOREFRONT MANAGER MODULE
// ==========================================
const StorefrontView = ({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) => {
  const [dayStatus, setDayStatus] = useStickyState<'standby' | 'review' | 'live'>('standby', `day_status_${clientConfig?.id}`);
  
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const codeA = `${month}${day}A`;
  const codeB = `${month}${day}B`;

  const toggleFlag = (itemId: string, flagType: 'featured' | 'dailyDeal') => {
    setStock((prev: any[]) => prev.map((item: any) => 
      item.id === itemId ? { ...item, [flagType]: !item[flagType] } : item
    ));
    setNotification(`Updated: ${flagType === 'featured' ? 'Featured Status' : 'Daily Deal'}`);
  };

  const advancePipeline = (nextState: 'review' | 'live' | 'standby') => {
    setDayStatus(nextState);
    if (nextState === 'live') {
      setNotification("Codes Generated. Storefront is LIVE.");
    } else if (nextState === 'standby') {
      setNotification("Day Closed. Resetting sequence.");
    }
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-500/10 p-3 rounded-2xl border border-fuchsia-500/30 text-fuchsia-400">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Daily Operations</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Storefront Pipeline</p>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
           <div className={`w-2 h-2 rounded-full ${dayStatus === 'live' ? 'bg-emerald-500 animate-pulse' : dayStatus === 'review' ? 'bg-amber-500' : 'bg-zinc-600'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
             {dayStatus === 'live' ? 'Market Live' : dayStatus === 'review' ? 'Menu Review' : 'Market Closed'}
           </span>
        </div>
      </div>

      {dayStatus === 'standby' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <Store size={48} className="text-zinc-700 mb-6" />
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Start New Day</h3>
          <p className="text-sm font-bold text-zinc-500 mb-8 max-w-sm">Initiate the daily sequence to review the menu and generate today's secure access codes.</p>
          <button 
            onClick={() => advancePipeline('review')}
            className="bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black uppercase tracking-widest py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(217,70,239,0.3)] flex items-center gap-2"
          >
            <Zap size={20} /> Ignite The Day
          </button>
        </div>
      )}

      {dayStatus === 'review' && (
        <div className="animate-in slide-in-from-bottom-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex justify-between items-center shadow-inner">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} /> Reviewing Board Before Code Generation
            </p>
            <button 
              onClick={() => advancePipeline('live')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-widest py-2 px-6 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              Lock Menu & Generate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stock.map((item: any) => {
              const matrixData = inventoryMatrix?.find((i: any) => i.id === item.id);
              const availableUnits = matrixData ? matrixData.available : item.onHand;
              const isAbundant = availableUnits >= 15;

              return (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 transition-all hover:border-zinc-700 relative overflow-hidden">
                  
                  {isAbundant && !item.dailyDeal && (
                     <div className="absolute top-0 left-0 w-full bg-emerald-500/10 border-b border-emerald-500/20 py-1 flex items-center justify-center gap-1.5 animate-pulse">
                       <TrendingDown size={12} className="text-emerald-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">System Suggestion: High Yield ({availableUnits} avail) - Push Deal</span>
                     </div>
                  )}

                  <div className={`flex justify-between items-start mb-4 ${isAbundant && !item.dailyDeal ? 'mt-6' : ''}`}>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{item.category}</p>
                      <h3 className="text-lg font-black text-white uppercase leading-none">{item.name}</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      onClick={() => toggleFlag(item.id, 'featured')}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${item.featured ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-cyan-400 hover:border-cyan-500/30'}`}
                    >
                      <span className="text-lg leading-none">{item.featured ? '⭐' : '☆'}</span> 
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.featured ? 'Featured Active' : 'Set Feature'}</span>
                    </button>

                    <button 
                      onClick={() => toggleFlag(item.id, 'dailyDeal')}
                      className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${item.dailyDeal ? 'bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-[0_0_15px_rgba(243,64,84,0.2)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-rose-400 hover:border-rose-500/30'}`}
                    >
                      <Flame size={18} className={item.dailyDeal ? "animate-pulse" : ""} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.dailyDeal ? 'Deal Active' : 'Set Deal'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {dayStatus === 'live' && (
        <div className="animate-in slide-in-from-bottom-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 mb-8 text-center shadow-lg">
            <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <CheckCircle size={24} /> Transmission Payloads Ready
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Shift A (Morning - Pre 2PM)</p>
                <p className="text-4xl font-black text-white font-mono tracking-widest">{codeA}</p>
                <button 
                  onClick={() => { navigator.clipboard.writeText(`☀️ MORNING DROP IS LIVE.\nAccess Code: ${codeA}\nMenu is locked in.`); setNotification("Morning Code Copied!"); }}
                  className="w-full mt-4 bg-zinc-900 hover:bg-cyan-500/20 border border-zinc-800 hover:border-cyan-500/50 text-cyan-400 font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all"
                >
                  Copy Telegram Drop
                </button>
              </div>

              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Shift B (Afternoon - Post 2PM)</p>
                <p className="text-4xl font-black text-white font-mono tracking-widest">{codeB}</p>
                <button 
                  onClick={() => { navigator.clipboard.writeText(`🌙 AFTERNOON SHIFT ACTIVE.\nMorning carts are CLEARED.\nAccess Code: ${codeB}`); setNotification("Afternoon Code Copied!"); }}
                  className="w-full mt-4 bg-zinc-900 hover:bg-fuchsia-500/20 border border-zinc-800 hover:border-fuchsia-500/50 text-fuchsia-400 font-bold uppercase tracking-widest text-[10px] py-3 rounded-xl transition-all"
                >
                  Copy Telegram Drop
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-zinc-800">
             <button onClick={() => advancePipeline('standby')} className="text-[10px] font-black text-zinc-600 hover:text-rose-500 uppercase tracking-widest transition-colors">
               End Day & Close Market
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN CONTROLLER: ADMIN TERMINAL
// ==========================================
export default function AdminTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const cid = clientConfig.id;
  const [activeModule, setActiveModule] = useState<'fulfillment' | 'inventory' | 'storefront'>('fulfillment');
  const [notification, setNotification] = useState<string | null>(null);

  // Database State
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
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 left-4 right-4 z-50 bg-emerald-500 text-zinc-950 p-4 rounded-2xl font-black flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-in slide-in-from-top-8">
          <Bell size={20} className="animate-bounce" />
          <span className="uppercase tracking-widest text-sm">{notification}</span>
        </div>
      )}

      {/* Global Header */}
      <header className="bg-zinc-900 p-4 md:px-8 flex items-center justify-between border-b border-zinc-800 z-20 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-xl border border-zinc-800 transition-colors">
            <LayoutGrid size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-emerald-400" />
            <h1 className="font-black text-lg tracking-wider uppercase text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-zinc-100 hidden sm:block">Admin Command</h1>
          </div>
        </div>
        
        {/* Module Navigation */}
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 gap-1">
           <button onClick={() => setActiveModule('fulfillment')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'fulfillment' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}>
             <Truck size={14} className="hidden sm:block" /> Orders
           </button>
           <button onClick={() => setActiveModule('inventory')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'inventory' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}>
             <Boxes size={14} className="hidden sm:block" /> Inventory
           </button>
           <button onClick={() => setActiveModule('storefront')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeModule === 'storefront' ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 'text-zinc-500 hover:text-zinc-300'}`}>
             <Store size={14} className="hidden sm:block" /> Store
           </button>
        </div>

        <button onClick={simulateNewOrder} className="bg-zinc-800 p-2 rounded-xl text-emerald-400 border border-emerald-900/30 active:scale-95 transition-all hover:bg-emerald-500/10 hidden sm:block">
          <Zap size={20} />
        </button>
      </header>

      {/* Module Rendering */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto">
        {activeModule === 'fulfillment' && <FulfillmentView orders={orders} setOrders={setOrders} notification={notification} setNotification={setNotification} />}
        {activeModule === 'inventory' && <InventoryView stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} />}
        {activeModule === 'storefront' && <StorefrontView stock={stock} setStock={setStock} inventoryMatrix={inventoryMatrix} setNotification={setNotification} clientConfig={clientConfig} />}
      </main>
    </div>
  );
}