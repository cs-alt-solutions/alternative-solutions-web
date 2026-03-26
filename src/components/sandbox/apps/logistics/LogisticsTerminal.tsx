/* src/components/sandbox/apps/logistics/LogisticsTerminal.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { Truck, Store, Coffee, Utensils, ArrowLeft, Plus, Minus, ShoppingCart, MapPin, CheckCircle, Briefcase, Send, Ban, Edit2, Clock, Wrench, X, ShoppingBag, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

// Import our newly abstracted components
import { EditItemModal, ShortageAllocatorModal, ItemReallocationModal, ShareManifestModal } from './LogisticsModals';

// ==========================================
// DYNAMIC THEME & ICON MAPPING
// ==========================================
const ICON_MAP: Record<string, any> = { Briefcase, Coffee, Store, Utensils, Wrench, MapPin };

const THEME_MAP: Record<string, any> = {
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500", bgLight: "bg-emerald-950/40", border: "border-emerald-500/50", borderHover: "group-hover:border-emerald-500/50", textHover: "group-hover:text-emerald-400", glow: "drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]", shadow: "shadow-[0_0_10px_rgba(52,211,153,0.4)]" },
  fuchsia: { text: "text-fuchsia-400", bg: "bg-fuchsia-500", bgLight: "bg-fuchsia-950/40", border: "border-fuchsia-500/50", borderHover: "group-hover:border-fuchsia-500/50", textHover: "group-hover:text-fuchsia-400", glow: "drop-shadow-[0_0_8px_rgba(232,121,249,0.8)]", shadow: "shadow-[0_0_10px_rgba(232,121,249,0.4)]" },
  blue: { text: "text-blue-400", bg: "bg-blue-500", bgLight: "bg-blue-950/40", border: "border-blue-500/50", borderHover: "group-hover:border-blue-500/50", textHover: "group-hover:text-blue-400", glow: "drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]", shadow: "shadow-[0_0_10px_rgba(96,165,250,0.4)]" },
  amber: { text: "text-amber-400", bg: "bg-amber-500", bgLight: "bg-amber-950/40", border: "border-amber-500/50", borderHover: "group-hover:border-amber-500/50", textHover: "group-hover:text-amber-400", glow: "drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]", shadow: "shadow-[0_0_10px_rgba(251,191,36,0.4)]" },
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500", bgLight: "bg-cyan-950/40", border: "border-cyan-500/50", borderHover: "group-hover:border-cyan-500/50", textHover: "group-hover:text-cyan-400", glow: "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]", shadow: "shadow-[0_0_10px_rgba(34,211,238,0.4)]" },
  rose: { text: "text-rose-400", bg: "bg-rose-500", bgLight: "bg-rose-950/40", border: "border-rose-500/50", borderHover: "group-hover:border-rose-500/50", textHover: "group-hover:text-rose-400", glow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]", shadow: "shadow-[0_0_10px_rgba(244,63,94,0.4)]" }
};

const ACTIONS = { complete: "Finalize Deliveries" };

// ==========================================
// SUB-COMPONENTS 
// ==========================================
const AppHeader = ({ view, setView, totalItems, onExit, appName }: any) => (
  <header className="bg-zinc-950 text-zinc-100 p-4 md:px-8 flex items-center justify-between border-b border-zinc-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-20 shrink-0">
    <div className="flex items-center gap-3">
      <button onClick={onExit} className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 rounded-full transition-colors" title="Exit App"><X size={18} /></button>
      {view !== 'builder' && <button onClick={() => setView('builder')} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-cyan-400 rounded transition-colors"><ArrowLeft size={20} /></button>}
      <Truck size={24} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] ml-2" />
      <h1 className="font-black text-lg tracking-wider text-transparent bg-clip-text bg-linear-to-r from-zinc-100 to-zinc-400 uppercase hidden sm:block">{appName || "Logistics"}</h1>
    </div>
    {view !== 'master' && view !== 'summary' && (
      <button onClick={() => setView('master')} className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-4 py-2 rounded-xl text-sm font-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
        <ShoppingCart size={18} /><span>{totalItems}</span>
      </button>
    )}
  </header>
);

const CatalogRow = ({ item, quantity, onAdd, onRemove, onEdit, activeTheme }: any) => (
  <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md transition-colors hover:border-zinc-700 h-full">
    <div className="flex-1 pr-2 w-full">
      <div className="flex items-center justify-between sm:justify-start gap-2 w-full">
        <h3 className="font-bold text-zinc-100 leading-tight text-lg">{item.name}</h3>
        <button onClick={onEdit} className={`text-zinc-500 hover:${activeTheme.text} transition-colors bg-zinc-900/50 p-1.5 rounded-md shrink-0`} title="Edit Item"><Edit2 size={16} /></button>
      </div>
      <span className={`text-[11px] font-bold ${activeTheme.text} ${activeTheme.bgLight} ${activeTheme.border} border px-2 py-0.5 rounded uppercase tracking-wider mt-2 inline-block`}>{item.unit}</span>
    </div>
    <div className="flex items-center gap-4 bg-zinc-900 rounded-xl p-1 border border-zinc-700 shadow-inner w-full sm:w-auto justify-between sm:justify-center shrink-0">
      <button onClick={onRemove} disabled={quantity === 0} className={`p-3 sm:p-2 rounded-lg transition-colors ${quantity > 0 ? `bg-zinc-800 text-zinc-300 border border-zinc-700 hover:text-rose-400 hover:border-rose-500/50` : 'text-zinc-600 cursor-not-allowed'}`}><Minus size={20} /></button>
      <span className="w-8 text-center font-black text-xl text-zinc-100">{quantity}</span>
      <button onClick={onAdd} className={`p-3 sm:p-2 rounded-lg bg-zinc-800 ${activeTheme.text} border border-zinc-700 hover:${activeTheme.border} hover:${activeTheme.shadow} transition-all`}><Plus size={20} /></button>
    </div>
  </div>
);

// ==========================================
// MAIN COMPONENT EXPORT (The Engine)
// ==========================================
interface LogisticsTerminalProps {
  clientConfig: any;
  onExit: () => void;
}

export default function LogisticsTerminal({ clientConfig, onExit }: LogisticsTerminalProps) {
  const logisticsData = clientConfig.logistics;
  const cid = clientConfig.id;
  const vendorList = logisticsData.vendors || [];

  const enrichedLocations = useMemo(() => {
    const locs: any = {};
    Object.entries(logisticsData.locations).forEach(([k, v]: [string, any]) => {
      locs[k] = { ...v, icon: ICON_MAP[v.iconName] || MapPin, theme: THEME_MAP[v.themeKey] || THEME_MAP.emerald };
    });
    return locs;
  }, [logisticsData]);

  const locationKeys = Object.keys(enrichedLocations);

  const [view, setView] = useStickyState('builder', `log_view_${cid}`); 
  const [activeLocKey, setActiveLocKey] = useStickyState(locationKeys[0] || '', `log_activeLocKey_${cid}`); 
  const [masterTab, setMasterTab] = useStickyState('grocery', `log_masterTab_${cid}`); 
  
  const [catalog, setCatalog] = useStickyState(logisticsData.catalog, `log_catalog_${cid}`);
  const [orders, setOrders] = useStickyState<Record<string, Record<string, number>>>({}, `log_orders_${cid}`);
  const [deliveredStatus, setDeliveredStatus] = useStickyState<Record<string, Record<string, boolean>>>({}, `log_deliv_${cid}`);
  const [procuredStatus, setProcuredStatus] = useStickyState<Record<string, boolean>>({}, `log_procured_${cid}`);
  const [purchasedFrom, setPurchasedFrom] = useStickyState<Record<string, string>>({}, `log_purchased_${cid}`);
  const [oosStatus, setOosStatus] = useStickyState<Record<string, boolean>>({}, `log_oos_${cid}`);
  const [deliveryStartTime, setDeliveryStartTime] = useStickyState<string | null>(null, `log_startTime_${cid}`);

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null); 
  const [newItem, setNewItem] = useState({ name: '', unit: '', preferredVendor: '', locations: [] as string[] });
  const [shortagePromptItem, setShortagePromptItem] = useState<string | null>(null);
  const [manifestModalType, setManifestModalType] = useState<string | null>(null); 
  const [reallocateItem, setReallocateItem] = useState<string | null>(null);

  const handleMasterTabSwitch = (tab: string) => {
    if (tab === 'delivery' && !deliveryStartTime) {
      setDeliveryStartTime(new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }));
    }
    setMasterTab(tab);
  };

  const toggleDelivery = (locId: string, itemId: string) => setDeliveredStatus(prev => ({ ...prev, [locId]: { ...(prev[locId] || {}), [itemId]: !(prev[locId]?.[itemId]) } }));
  const toggleProcured = (itemId: string) => setProcuredStatus(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  const toggleOOS = (itemId: string) => setOosStatus(prev => ({ ...prev, [itemId]: !prev[itemId] }));

  const updateQuantity = (locId: string, itemId: string, delta: number) => {
    setOrders(prev => {
      const currentLocOrders = prev[locId] || {};
      const currentQty = currentLocOrders[itemId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      return { ...prev, [locId]: { ...currentLocOrders, [itemId]: newQty } };
    });
  };

  const handleDecreaseGlobalQty = (itemId: string) => {
    const locationsWithItem = Object.keys(orders).filter(locId => orders[locId][itemId] > 0);
    if (locationsWithItem.length > 1) {
      setShortagePromptItem(itemId);
    } else if (locationsWithItem.length === 1) {
      updateQuantity(locationsWithItem[0], itemId, -1);
    }
  };

  const handleIncreaseGlobalQty = (itemId: string) => {
    setOrders(prev => {
      const newOrders = JSON.parse(JSON.stringify(prev));
      let applied = false;
      for (const locId of Object.keys(newOrders)) {
        if (newOrders[locId] && newOrders[locId][itemId] > 0) {
          newOrders[locId][itemId] += 1;
          applied = true; break;
        }
      }
      if (!applied) {
        const fallbackLoc = locationKeys[0];
        if (!newOrders[fallbackLoc]) newOrders[fallbackLoc] = {};
        newOrders[fallbackLoc][itemId] = (newOrders[fallbackLoc][itemId] || 0) + 1;
      }
      return newOrders;
    });
  };

  const resolveShortage = (locId: string, itemId: string) => { updateQuantity(locId, itemId, -1); setShortagePromptItem(null); };

  const handleAddNewItem = (e: any) => {
    e.preventDefault();
    if (!newItem.name.trim() || newItem.locations.length === 0) return;
    const newItemId = `item-${Date.now()}`;
    setCatalog((prev: any) => [...prev, { id: newItemId, name: newItem.name.trim(), unit: newItem.unit.trim() || 'Each', category: 'Custom', preferredVendor: newItem.preferredVendor || "Local Supplier", locations: newItem.locations }]);
    setNewItem({ name: '', unit: '', preferredVendor: '', locations: [] });
    setShowAddItemForm(false);
  };

  const handleUpdateItem = (updatedItem: any) => { setCatalog((prev: any) => prev.map((i: any) => i.id === updatedItem.id ? updatedItem : i)); setEditingItem(null); };

  const totalMasterItems = useMemo(() => {
    let total = 0;
    Object.values(orders).forEach((locOrder: any) => { Object.values(locOrder).forEach((qty: any) => { total += qty; }); });
    return total;
  }, [orders]);

  const masterShoppingList = useMemo(() => {
    const list: any = {};
    Object.entries(orders).forEach(([locId, locItems]: [string, any]) => {
      Object.entries(locItems).forEach(([itemId, qty]: [string, any]) => {
        if (qty > 0) {
          if (!list[itemId]) list[itemId] = { qty: 0, locations: [] };
          list[itemId].qty += qty;
          list[itemId].locations.push({ name: enrichedLocations[locId]?.name || locId, qty });
        }
      });
    });
    return list;
  }, [orders, enrichedLocations]);

  const hasOosItems = Object.keys(masterShoppingList).some(id => oosStatus[id]);
  const activeLocation = enrichedLocations[activeLocKey];

  return (
    <div className="bg-zinc-950 font-sans w-full min-h-dvh flex flex-col selection:bg-cyan-500/30">
      <AppHeader view={view} setView={setView} totalItems={totalMasterItems} onExit={onExit} appName={clientConfig.appTitle} />

      {view === 'builder' && (
        <div className="flex flex-wrap md:flex-nowrap overflow-x-auto scrollbar-hide gap-3 px-4 md:px-8 py-4 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10 shadow-lg justify-start lg:justify-center">
          {Object.entries(enrichedLocations).map(([key, loc]: [string, any]) => {
            const isActive = activeLocKey === key;
            const Icon = loc.icon;
            const theme = loc.theme;
            const locQty = Object.values(orders[loc.id] || {}).reduce((a: any, b: any) => a + b, 0);
            
            return (
              <button key={key} onClick={() => setActiveLocKey(key)} className={`snap-start shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all border ${isActive ? `${theme.bgLight} ${theme.border} ${theme.text} ${theme.shadow}` : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}>
                <Icon size={16} className={isActive ? theme.glow : ''} /> {loc.name}
                {locQty > 0 && <span className={`ml-2 px-2 py-0.5 rounded-md text-[10px] ${isActive ? `${theme.bg} text-zinc-950` : 'bg-zinc-800 text-zinc-400'}`}>{locQty as React.ReactNode}</span>}
              </button>
            );
          })}
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 scrollbar-hide w-full max-w-400 mx-auto">
        {view === 'builder' && activeLocation && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-black text-zinc-400 tracking-tight uppercase flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${activeLocation.theme.bg} ${activeLocation.theme.glow}`}></span> Active Matrix: <span className={activeLocation.theme.text}>{activeLocation.name}</span>
              </h2>
              <button onClick={() => { setNewItem({ name: '', unit: '', preferredVendor: '', locations: [activeLocation.id] }); setShowAddItemForm(true); }} className={`p-3 rounded-xl border border-dashed border-zinc-700 text-zinc-500 font-black flex items-center justify-center gap-2 hover:bg-zinc-800 ${activeLocation.theme.borderHover} ${activeLocation.theme.textHover} transition-all uppercase tracking-wider`}>
                <Plus size={18} /> Inject Custom Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catalog.filter((item: any) => item.locations && item.locations.includes(activeLocation.id)).map((item: any) => (
                <CatalogRow key={item.id} item={item} quantity={(orders[activeLocation.id] || {})[item.id] || 0} activeTheme={activeLocation.theme} onAdd={() => updateQuantity(activeLocation.id, item.id, 1)} onRemove={() => updateQuantity(activeLocation.id, item.id, -1)} onEdit={() => setEditingItem(item)} />
              ))}

              {showAddItemForm && (
                <form onSubmit={handleAddNewItem} className={`p-5 rounded-2xl border ${activeLocation.theme.border} bg-zinc-900 ${activeLocation.theme.shadow} animate-in fade-in slide-in-from-top-2 md:col-span-2 xl:col-span-3 max-w-2xl`}>
                  <h3 className={`font-black ${activeLocation.theme.text} mb-4 text-sm uppercase tracking-widest`}>Inject Custom Item</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Item Name (e.g., Paper Towels)" className={`w-full p-3 rounded-xl border border-zinc-700 bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-${activeLocation.theme.text.split('-')[1]}-500 font-bold text-zinc-100 placeholder:text-zinc-600 transition-shadow shadow-inner`} value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} autoFocus />
                      <input type="text" placeholder="Unit (e.g., 12-Roll Pack, Each)" className={`w-full p-3 rounded-xl border border-zinc-700 bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-${activeLocation.theme.text.split('-')[1]}-500 font-bold text-zinc-100 placeholder:text-zinc-600 transition-shadow shadow-inner`} value={newItem.unit} onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })} />
                    </div>
                    <select className={`w-full max-w-md p-3 rounded-xl border border-zinc-700 bg-zinc-950 focus:outline-none focus:ring-2 focus:ring-${activeLocation.theme.text.split('-')[1]}-500 font-bold text-zinc-300 transition-shadow shadow-inner`} value={newItem.preferredVendor} onChange={(e) => setNewItem({ ...newItem, preferredVendor: e.target.value })}>
                      <option value="">Select Primary Vendor...</option>
                      {vendorList.map((v: string) => <option key={v} value={v}>{v}</option>)}
                    </select>
                    
                    <div className="pt-2 border-t border-zinc-800">
                      <label className={`text-[10px] font-black ${activeLocation.theme.text} uppercase tracking-widest ml-1 mb-3 block`}>Target Sectors (Select Multiple)</label>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(enrichedLocations).map((loc: any) => {
                          const isSelected = newItem.locations.includes(loc.id);
                          return (
                            <button type="button" key={loc.id} onClick={() => { setNewItem(prev => { if (prev.locations.includes(loc.id)) { return { ...prev, locations: prev.locations.filter(id => id !== loc.id) }; } else { return { ...prev, locations: [...prev.locations, loc.id] }; } }); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${isSelected ? `${loc.theme.bgLight} ${loc.theme.border} ${loc.theme.text} shadow-inner` : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}>
                              {loc.name}
                            </button>
                          );
                        })}
                      </div>
                      {newItem.locations.length === 0 && <p className="text-[10px] font-bold text-rose-500 mt-3 ml-1">At least one sector is required.</p>}
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-zinc-800 mt-4 max-w-md">
                      <button type="button" onClick={() => setShowAddItemForm(false)} className="flex-1 py-3 rounded-xl font-black text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-100 transition-colors border border-zinc-700">ABORT</button>
                      <button type="submit" disabled={!newItem.name.trim() || newItem.locations.length === 0} className={`flex-1 py-3 rounded-xl font-black text-zinc-950 ${activeLocation.theme.bg} disabled:bg-zinc-700 disabled:text-zinc-500 transition-all ${activeLocation.theme.shadow} disabled:shadow-none`}>INJECT</button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {view === 'master' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto">
             <div className="mb-8 mt-2 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-black text-zinc-100 tracking-tight uppercase">Master Truck List</h2>
              <p className="text-zinc-500 mt-2 font-semibold uppercase tracking-wider text-sm flex items-center justify-center md:justify-start gap-2">
                <Clock size={16} /> {deliveryStartTime ? `Delivery Locked In: ${deliveryStartTime}` : "Procurement Phase Active"}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-64 shrink-0 flex flex-col gap-3">
                <button onClick={() => handleMasterTabSwitch('grocery')} className={`flex items-center justify-center md:justify-start gap-3 p-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${masterTab === 'grocery' ? 'bg-zinc-800 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] border border-zinc-700' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                  <ShoppingBag size={20} /> Grocery List
                </button>
                <button onClick={() => handleMasterTabSwitch('delivery')} className={`flex items-center justify-center md:justify-start gap-3 p-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${masterTab === 'delivery' ? 'bg-zinc-800 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)] border border-zinc-700' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                  <MapPin size={20} /> Delivery List
                </button>
                
                {masterTab === 'delivery' && Object.keys(masterShoppingList).length > 0 && (
                  <button onClick={() => setView('summary')} className="mt-4 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-wider p-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] flex items-center justify-center md:justify-start gap-3 transition-all">
                    <CheckCircle size={20} /> {ACTIONS.complete}
                  </button>
                )}
              </div>

              <div className="flex-1">
                {Object.keys(masterShoppingList).length === 0 ? (
                  <div className="text-center p-12 bg-zinc-900 rounded-3xl border border-dashed border-zinc-700 h-full flex flex-col items-center justify-center">
                    <ShoppingCart size={64} className="mx-auto text-zinc-700 mb-6" />
                    <h3 className="text-zinc-400 font-black uppercase tracking-widest text-xl">Payload Empty</h3>
                    <p className="text-zinc-600 mt-2 font-medium">Inject items via sector menus to populate the master list.</p>
                  </div>
                ) : (
                  <div>
                    {masterTab === 'grocery' && (
                      <div className="space-y-6">
                        {hasOosItems ? (
                           <div className="bg-rose-950/40 border border-rose-900/50 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner mb-6 animate-in fade-in">
                             <div><h3 className="font-black text-rose-400 text-lg uppercase tracking-wide">Shortages Logged</h3><p className="text-sm text-rose-500/80 mt-1 font-semibold">Alert the team immediately for alternatives.</p></div>
                             <button onClick={() => setManifestModalType('oos')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-400 border border-rose-400 text-zinc-950 px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] hover:shadow-[0_0_20px_rgba(244,63,94,0.6)]"><AlertTriangle size={18} /> Transmit OOS Alert</button>
                           </div>
                        ) : (
                          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner mb-6">
                            <div><h3 className="font-black text-zinc-300 text-lg uppercase tracking-wide">Briefing Complete?</h3><p className="text-sm text-zinc-500 mt-1 font-semibold">Transmit procurement vectors to the team.</p></div>
                            <button onClick={() => setManifestModalType('grocery')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-cyan-400 px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all shadow-md hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"><ClipboardCheck size={18} /> Share Plan</button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {[...vendorList, "Unassigned"].map((vendorName: string) => {
                            const vendorItems = Object.entries(masterShoppingList).filter(([itemId]) => {
                              const itemData = catalog.find((i: any) => i.id === itemId);
                              const currentVendor = purchasedFrom[itemId] || itemData?.preferredVendor || "Unassigned";
                              return currentVendor === vendorName;
                            });

                            if (vendorItems.length === 0) return null;

                            return (
                              <div key={vendorName} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg">
                                <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 mb-4">
                                  <Store size={24} className="text-cyan-500 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" />
                                  <h3 className="font-black text-lg text-zinc-200 uppercase tracking-widest">{vendorName}</h3>
                                  <span className="bg-zinc-950 border border-zinc-800 text-zinc-500 text-sm font-black px-3 py-1 rounded-lg ml-auto shadow-inner">{vendorItems.length}</span>
                                </div>
                                
                                <div className="space-y-3">
                                  {vendorItems.map(([itemId, data]: any) => {
                                    const itemData = catalog.find((i: any) => i.id === itemId);
                                    const currentVendor = purchasedFrom[itemId] || itemData.preferredVendor || "Unassigned";
                                    const isProcured = procuredStatus[itemId];
                                    const isOos = oosStatus[itemId];
                                    
                                    return (
                                      <div key={itemId} className={`bg-zinc-950 p-4 rounded-2xl shadow-inner border flex flex-col gap-4 transition-all duration-300 ${isOos ? 'border-rose-500/50' : isProcured ? 'border-cyan-900/50' : 'border-zinc-800'}`}>
                                        <div className="flex items-center justify-between gap-4">
                                          <button onClick={() => !isOos && toggleProcured(itemId)} disabled={isOos} className={`flex items-center gap-4 text-left flex-1 group ${isOos ? 'cursor-not-allowed opacity-50' : ''}`}>
                                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${isProcured ? 'bg-cyan-500 border-cyan-400 text-zinc-950 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-zinc-600 bg-zinc-900 group-hover:border-cyan-500/50'}`}>
                                              {isProcured && <CheckCircle size={20} />}
                                            </div>
                                            <div>
                                              <h3 className={`font-bold text-lg transition-colors ${isOos ? 'text-rose-400 line-through' : isProcured ? 'text-zinc-600 line-through' : 'text-zinc-100 group-hover:text-cyan-50'}`}>{itemData.name}</h3>
                                              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-wider mt-1 block">{itemData.unit}</span>
                                            </div>
                                          </button>
                                          <div className={`flex items-center p-1 rounded-xl shadow-md border transition-colors shrink-0 ${isOos ? 'bg-rose-950/50 border-rose-900/50 opacity-50' : isProcured ? 'bg-cyan-950/40 border-cyan-900/50' : 'bg-zinc-900 border-zinc-700'}`}>
                                            <button onClick={() => !isOos && handleDecreaseGlobalQty(itemId)} disabled={isOos} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-rose-500 transition-colors"><Minus size={18} /></button>
                                            <div className={`font-black text-2xl w-12 flex items-center justify-center transition-colors ${isOos ? 'text-rose-500' : isProcured ? 'text-cyan-600' : 'text-zinc-200'}`}>{data.qty}</div>
                                            <button onClick={() => !isOos && handleIncreaseGlobalQty(itemId)} disabled={isOos} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-cyan-400 transition-colors"><Plus size={18} /></button>
                                          </div>
                                        </div>
                                        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
                                          <button onClick={() => toggleOOS(itemId)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isOos ? 'bg-rose-500 text-zinc-950 shadow-[0_0_10px_rgba(244,63,94,0.4)]' : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50'}`}>
                                            <Ban size={16} /> {isOos ? 'Marked OOS' : 'Mark OOS'}
                                          </button>
                                          <select disabled={isOos} className={`text-sm bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-2 text-zinc-300 font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 shadow-inner ${isOos ? 'opacity-50 cursor-not-allowed' : ''}`} value={currentVendor} onChange={(e) => setPurchasedFrom(prev => ({...prev, [itemId]: e.target.value}))}>
                                            <option value="Unassigned" disabled>Select Vector...</option>
                                            {vendorList.map((v: string) => <option key={v} value={v}>{v}</option>)}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {masterTab === 'delivery' && (
                      <div className="space-y-6">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-inner mb-6">
                          <div><h3 className="font-black text-zinc-300 text-lg uppercase tracking-wide">Procurement Secured?</h3><p className="text-sm text-zinc-500 mt-1 font-semibold">Transmit routing payload to destination teams.</p></div>
                          <button onClick={() => setManifestModalType('delivery')} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-cyan-400 px-6 py-3 rounded-xl font-black uppercase tracking-wider transition-all shadow-md hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"><Send size={18} /> Transmit</button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                          {Object.values(enrichedLocations).map((loc: any) => {
                            const locOrders = orders[loc.id] || {};
                            const activeItems = Object.keys(locOrders).filter(itemId => locOrders[itemId] > 0 && !oosStatus[itemId]);
                            if (activeItems.length === 0) return null;
                            const theme = loc.theme;

                            return (
                              <div key={loc.id} className={`bg-zinc-900 rounded-3xl shadow-lg border ${theme.border} overflow-hidden h-full flex flex-col`}>
                                <div className={`${theme.bgLight} px-6 py-5 border-b ${theme.border} flex items-center gap-4 shrink-0`}>
                                  <loc.icon size={24} className={`${theme.text} ${theme.glow}`} />
                                  <h3 className={`font-black ${theme.text} uppercase tracking-widest text-lg`}>{loc.name}</h3>
                                </div>
                                <div className="p-3 flex-1 flex flex-col gap-2">
                                  {activeItems.map((itemId) => {
                                    const qty = locOrders[itemId];
                                    const itemData = catalog.find((i: any) => i.id === itemId);
                                    const isDelivered = deliveredStatus[loc.id]?.[itemId];
                                    
                                    return (
                                      <div key={itemId} className={`w-full flex flex-col sm:flex-row sm:items-center p-3 rounded-2xl border transition-all ${isDelivered ? 'bg-zinc-950 border-zinc-800/50 opacity-60' : 'bg-zinc-800 border-zinc-700 shadow-md'}`}>
                                        <div className="flex items-center w-full sm:w-auto flex-1">
                                          <button onClick={() => toggleDelivery(loc.id, itemId)} className="p-2 shrink-0 group mr-2">
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isDelivered ? `${theme.bg} ${theme.border} text-zinc-950 ${theme.shadow}` : 'border-zinc-600 bg-zinc-900 group-hover:border-zinc-500'}`}>{isDelivered && <CheckCircle size={18} />}</div>
                                          </button>
                                          <button onClick={() => setReallocateItem(itemId)} className="flex-1 flex justify-between items-center pl-2 text-left group">
                                            <span className={`font-bold text-lg ${isDelivered ? 'text-zinc-600 line-through' : `text-zinc-100 ${theme.textHover}`}`}>{itemData.name}</span>
                                            <div className={`font-black text-xl px-4 py-1.5 rounded-xl flex items-center gap-2 transition-all ml-4 ${isDelivered ? 'text-zinc-600 bg-zinc-900 border border-zinc-800' : `${theme.text} ${theme.bgLight} border ${theme.border} ${theme.borderHover} ${theme.shadow}`}`}>{qty}x</div>
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'summary' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-5xl mx-auto">
            <div className="mb-10 mt-6 text-center">
              <div className="w-20 h-20 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <CheckCircle size={40} className="drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-zinc-100 tracking-tight uppercase">Delivery Report</h2>
              <p className="text-zinc-500 mt-4 font-semibold uppercase tracking-widest flex items-center justify-center gap-2 text-sm"><Clock size={16} /> {deliveryStartTime ? `Run Time: ${deliveryStartTime}` : "Routing Successfully Terminated"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {Object.values(enrichedLocations).map((loc: any) => {
                const locOrders = orders[loc.id] || {};
                const deliveredForLoc = Object.keys(locOrders).filter(itemId => locOrders[itemId] > 0 && deliveredStatus[loc.id]?.[itemId] && !oosStatus[itemId]);
                if (deliveredForLoc.length === 0) return null;
                const theme = loc.theme;

                return (
                  <div key={loc.id} className="bg-zinc-900 p-6 rounded-3xl shadow-lg border border-zinc-800">
                    <div className={`flex items-center gap-3 mb-4 pb-4 border-b ${theme.border}`}>
                      <MapPin size={20} className={theme.text} />
                      <h4 className={`font-black ${theme.text} uppercase tracking-wider text-lg`}>{loc.name}</h4>
                    </div>
                    <div className={`pl-4 space-y-3 border-l-2 ${theme.border} ml-2`}>
                      {deliveredForLoc.map(itemId => {
                        const itemData = catalog.find((i: any) => i.id === itemId);
                        return (
                          <div key={itemId} className="text-base text-zinc-300 flex justify-between items-center">
                            <span className="font-bold">{itemData.name}</span><span className={`font-black ${theme.text} ${theme.bgLight} border ${theme.border} px-3 py-1 rounded-lg shadow-inner`}>{locOrders[itemId]}x</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              {Object.keys(masterShoppingList).filter(id => oosStatus[id]).length > 0 && (
                 <div className="bg-zinc-900 p-6 rounded-3xl shadow-lg border border-zinc-800 md:col-span-2">
                   <div className="flex items-center gap-3 mb-4 pb-4 border-b border-rose-900/50">
                      <Ban size={20} className="text-rose-500" />
                      <h4 className="font-black text-rose-400 uppercase tracking-wider text-lg">Skipped / Out of Stock</h4>
                   </div>
                   <div className="pl-4 space-y-3 border-l-2 border-rose-900/50 ml-2">
                     {Object.keys(masterShoppingList).filter(id => oosStatus[id]).map(itemId => {
                        const itemData = catalog.find((i: any) => i.id === itemId);
                        return (
                          <div key={itemId} className="text-base text-zinc-500 flex justify-between items-center">
                            <span className="font-bold line-through decoration-rose-500/50">{itemData.name}</span><span className="font-black text-rose-500 bg-rose-950/20 border border-rose-900/50 px-3 py-1 rounded-lg">OOS</span>
                          </div>
                        );
                     })}
                   </div>
                 </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <button onClick={() => setManifestModalType('final')} className="flex-1 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 hover:border-cyan-500/50 text-cyan-400 font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-3 transition-all"><Send size={20} /> Transmit Final Record</button>
              <button onClick={() => { setOrders({}); setDeliveredStatus({}); setProcuredStatus({}); setPurchasedFrom({}); setOosStatus({}); setDeliveryStartTime(null); setView('builder'); }} className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-rose-950/40 hover:border-rose-500/50 hover:text-rose-400 text-zinc-500 font-black uppercase tracking-wider py-4 px-6 rounded-2xl shadow-inner flex items-center justify-center gap-3 transition-all"><Truck size={20} /> Initialize New Run</button>
            </div>
          </div>
        )}
      </main>

      {/* Modal Portals */}
      {editingItem && <EditItemModal item={editingItem} onSave={handleUpdateItem} onClose={() => setEditingItem(null)} enrichedLocations={enrichedLocations} vendorList={vendorList} />}
      {shortagePromptItem && <ShortageAllocatorModal itemId={shortagePromptItem} catalog={catalog} orders={orders} onResolve={resolveShortage} onCancel={() => setShortagePromptItem(null)} enrichedLocations={enrichedLocations} />}
      {reallocateItem && <ItemReallocationModal itemId={reallocateItem} catalog={catalog} orders={orders} onUpdateQuantity={updateQuantity} onClose={() => setReallocateItem(null)} enrichedLocations={enrichedLocations} />}
      {manifestModalType && <ShareManifestModal manifestType={manifestModalType} orders={orders} catalog={catalog} purchasedFrom={purchasedFrom} deliveredStatus={deliveredStatus} oosStatus={oosStatus} masterShoppingList={masterShoppingList} deliveryStartTime={deliveryStartTime} onClose={() => setManifestModalType(null)} enrichedLocations={enrichedLocations} vendorList={vendorList} />}
    </div>
  );
}