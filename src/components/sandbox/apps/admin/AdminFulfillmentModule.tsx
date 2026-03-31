import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Search, CalendarDays, ShieldAlert, ShieldCheck, Info, MapPin, ChevronDown, ChevronUp, ListOrdered, MessageSquare, Receipt } from 'lucide-react';

export default function AdminFulfillmentModule({ orders, setOrders, notification, setNotification }: any) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [activeZone, setActiveZone] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const pendingOrders = orders.filter((o: any) => o.status !== 'completed');
  const completedOrders = orders.filter((o: any) => o.status === 'completed');
  
  const completedZones = ['All', ...Array.from(new Set(completedOrders.map((o: any) => o.zone)))].filter(Boolean) as string[];

  const displayOrders = (activeTab === 'pending' ? pendingOrders : completedOrders)
    .filter((o: any) => activeTab === 'pending' || activeZone === 'All' || o.zone === activeZone)
    .filter((o: any) => 
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const verifyOrder = (orderId: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === orderId ? { ...o, status: 'verified_active' } : o));
    setNotification(`Order ${orderId} verified against Telegram!`);
  };

  const markCompleted = (orderId: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    setNotification(`Order ${orderId} marked as completed!`);
  };

  const todayString = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-cyan-500/10 p-4 rounded-3xl border border-cyan-500/30 text-cyan-400 shadow-lg">
            <Package size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Fulfillment Queue</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Live Logistics Feed <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /></div>
          </div>
        </div>
      </div>

      {/* HUMANIZED PROTOCOL WARNING */}
      <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-3xl p-5 mb-8 flex items-start gap-4 shadow-inner">
        <div className="bg-indigo-500/20 p-2 rounded-full shrink-0">
          <Info size={20} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-1.5">Telegram Match System</h3>
          <p className="text-xs text-zinc-300 font-medium leading-relaxed max-w-3xl">
            This dashboard works side-by-side with your Telegram intake. When a customer sends you their order text, check their Auth ID against this list. If everything matches up, hit "Verify Match". This helps catch mistakes, stop spam, and make sure your drivers only get real, confirmed orders.
          </p>
        </div>
      </div>

      {/* SEARCH & PRIMARY TABS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 w-full md:w-auto shadow-inner">
          <button 
            onClick={() => setActiveTab('pending')} 
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Pending ({pendingOrders.length})
          </button>
          <button 
            onClick={() => { setActiveTab('completed'); setActiveZone('All'); }} 
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Completed ({completedOrders.length})
          </button>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500/50 shadow-inner"
          />
        </div>
      </div>

      {/* SECONDARY TABS: ZONE ROUTING (Only visible in Completed tab) */}
      {activeTab === 'completed' && completedZones.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2 mb-4 animate-in fade-in slide-in-from-top-2">
          <MapPin size={14} className="text-zinc-600 shrink-0 mr-1" />
          {completedZones.map((zone: string) => (
             <button 
               key={zone}
               onClick={() => setActiveZone(zone)}
               className={`shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeZone === zone ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
             >
               {zone} {zone !== 'All' && `(${completedOrders.filter((o:any) => o.zone === zone).length})`}
             </button>
          ))}
        </div>
      )}

      {/* ORDER LIST */}
      <div className="space-y-4">
        {displayOrders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <Package size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-lg font-black text-zinc-400 uppercase tracking-widest mb-2">No Orders Found</h3>
            <p className="text-sm font-bold text-zinc-600">
              {activeTab === 'completed' && activeZone !== 'All' ? `No completed orders for ${activeZone}.` : 'The queue is currently clear.'}
            </p>
          </div>
        ) : (
          displayOrders.map((order: any) => {
            const isUnverified = order.status === 'pending_verification';
            const isExpanded = expandedOrders[order.id];

            return (
              <div key={order.id} className={`bg-zinc-900 border rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-6 shadow-sm transition-colors ${isUnverified ? 'border-amber-500/50 bg-amber-500/5' : 'border-zinc-800 hover:border-cyan-500/30'}`}>
                
                <div className="flex-1 flex flex-col w-full">
                  
                  {/* HEADER ROW */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Auth ID:</span>
                    <h3 className={`text-xl font-black uppercase tracking-widest font-mono ${isUnverified ? 'text-amber-400' : 'text-white'}`}>{order.id}</h3>
                    
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1 ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : isUnverified ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50 animate-pulse' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                      {order.status === 'pending_verification' ? <><ShieldAlert size={10}/> Awaiting Telegram Match</> : order.status === 'verified_active' ? <><ShieldCheck size={10}/> Verified & Active</> : order.status}
                    </span>
                  </div>
                  
                  {/* METADATA BADGES */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                    <span className="flex items-center gap-1.5 text-zinc-400"><CalendarDays size={12}/> {order.date || todayString}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12}/> {order.timeReceived}</span>
                    <span className="flex items-center gap-1.5 text-indigo-400"><MapPin size={12}/> {order.zone}</span>
                    <span className="text-zinc-300 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"/> {order.customer}</span>
                  </div>

                  {/* DYNAMIC ACCORDION TOGGLE */}
                  <button 
                    onClick={() => toggleOrderDetails(order.id)}
                    className={`w-full flex items-center justify-between bg-zinc-950 hover:bg-zinc-900 border ${isExpanded ? 'border-cyan-500/30 rounded-t-xl border-b-0' : 'border-zinc-800 rounded-xl'} p-3 transition-colors shadow-inner`}
                  >
                    <div className="flex items-center gap-2">
                      <Receipt size={14} className={isExpanded ? 'text-cyan-400' : 'text-zinc-500'} />
                      <span className={`text-xs font-black uppercase tracking-widest ${isExpanded ? 'text-cyan-400' : 'text-zinc-300'}`}>
                        {order.items.length} Items in Order
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                      {isExpanded ? 'Hide Details' : 'View Manifest'}
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </button>

                  {/* EXPANDABLE PICKING MANIFEST */}
                  {isExpanded && (
                    <div className="bg-zinc-950/80 border border-cyan-500/30 border-t-0 rounded-b-xl p-4 shadow-inner animate-in slide-in-from-top-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500/70 border-b border-dashed border-zinc-800 pb-2 mb-3 flex items-center gap-2">
                         <ListOrdered size={12}/> Picking Manifest
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex gap-3 items-start">
                             <div className="bg-zinc-900 border border-zinc-700 text-cyan-400 font-black text-xs px-2.5 py-1 rounded-lg shrink-0 shadow-sm">
                                {item.qtyRequired}x
                             </div>
                             <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-zinc-200 leading-tight">{item.name}</p>
                                {item.options && item.options !== 'Standard' && (
                                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-1 flex items-center gap-1.5">
                                      <span className="w-1 h-1 rounded-full bg-emerald-500"></span>
                                      <span className="text-emerald-400/70">Opt:</span> {item.options}
                                   </p>
                                )}
                             </div>
                          </div>
                        ))}
                      </div>
                      
                      {order.notes && (
                        <div className="mt-4 pt-3 border-t border-dashed border-zinc-800">
                           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                             <MessageSquare size={12}/> Customer Notes
                           </p>
                           <p className="text-xs text-amber-200/80 italic bg-amber-500/5 p-3 rounded-lg border border-amber-500/10">"{order.notes}"</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* RIGHT SIDE ACTIONS */}
                <div className="flex flex-row md:flex-col items-center justify-between md:justify-start gap-4 shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6 w-full md:w-40 mt-auto md:mt-0 h-full">
                  <div className="text-left md:text-center w-full md:w-auto">
                     <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Order Total</p>
                     <p className="text-xl font-mono font-black text-emerald-400">${order.total?.toFixed(2) || '0.00'}</p>
                  </div>
                  
                  {activeTab === 'pending' && isUnverified && (
                    <button 
                      onClick={() => verifyOrder(order.id)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 px-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-95 flex items-center justify-center gap-2 text-[10px] mt-auto"
                    >
                      <ShieldCheck size={14} /> Verify Match
                    </button>
                  )}

                  {activeTab === 'pending' && !isUnverified && (
                    <button 
                      onClick={() => markCompleted(order.id)}
                      className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-3 px-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 flex items-center justify-center gap-2 text-[10px] mt-auto"
                    >
                      <CheckCircle size={14} /> Mark Done
                    </button>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}