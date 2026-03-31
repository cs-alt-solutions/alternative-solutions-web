import React, { useState } from 'react';
import { Package, Clock, CheckCircle, Search, CalendarDays } from 'lucide-react';

export default function AdminFulfillmentModule({ orders, setOrders, notification, setNotification }: any) {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [searchTerm, setSearchTerm] = useState('');

  const pendingOrders = orders.filter((o: any) => o.status !== 'completed');
  const completedOrders = orders.filter((o: any) => o.status === 'completed');
  
  const displayOrders = (activeTab === 'pending' ? pendingOrders : completedOrders).filter((o: any) => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const markCompleted = (orderId: string) => {
    setOrders((prev: any[]) => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    setNotification(`Order ${orderId} marked as completed!`);
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
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

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex bg-zinc-950 border border-zinc-800 rounded-xl p-1 w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('pending')} 
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Pending ({pendingOrders.length})
          </button>
          <button 
            onClick={() => setActiveTab('completed')} 
            className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'}`}
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
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      <div className="space-y-4">
        {displayOrders.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
            <Package size={48} className="text-zinc-700 mb-4" />
            <h3 className="text-lg font-black text-zinc-400 uppercase tracking-widest mb-2">No Orders Found</h3>
            <p className="text-sm font-bold text-zinc-600">The queue is currently clear.</p>
          </div>
        ) : (
          displayOrders.map((order: any) => (
            <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:border-cyan-500/30 transition-colors">
              
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-wider">{order.id}</h3>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1.5"><Clock size={12}/> {order.timeReceived}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays size={12}/> {order.zone}</span>
                  <span className="text-zinc-300 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"/> {order.customer}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-sm font-medium">
                      <span className="text-zinc-300"><span className="text-cyan-400 font-bold">{item.qtyRequired}x</span> {item.name}</span>
                      <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{item.options || 'Standard'}</span>
                    </div>
                  ))}
                  {order.notes && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/50">
                      <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Customer Notes:</p>
                      <p className="text-xs text-zinc-400 italic">"{order.notes}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-zinc-800 pt-4 md:pt-0 md:pl-6">
                <div className="text-left md:text-center">
                   <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Order Total</p>
                   <p className="text-xl font-mono font-black text-emerald-400">${order.total?.toFixed(2) || '0.00'}</p>
                </div>
                {activeTab === 'pending' && (
                  <button 
                    onClick={() => markCompleted(order.id)}
                    className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-3 px-6 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95 flex items-center justify-center gap-2 text-xs"
                  >
                    <CheckCircle size={16} /> Mark Done
                  </button>
                )}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}