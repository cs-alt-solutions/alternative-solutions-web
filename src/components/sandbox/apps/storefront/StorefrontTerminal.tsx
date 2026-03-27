/* src/components/sandbox/apps/storefront/StorefrontTerminal.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, CheckCircle, Package, Lock, Clock, ArrowRight } from 'lucide-react';

export default function StorefrontTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  // Storefront Auth State
  const [isVerified, setIsVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [timeStatus, setTimeStatus] = useState({ label: "Checking Time...", color: "text-zinc-500", activeCode: "" });

  // Store State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const inventory = clientConfig.inventory;
  const customerCodes = clientConfig.security?.customerCodes || { morning: "WAKE", evening: "BAKE" };

  // Determine which code is active based on the time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) {
      setTimeStatus({ label: "Morning Window Active", color: "text-emerald-400", activeCode: customerCodes.morning });
    } else if (hour >= 12 && hour < 17) {
      setTimeStatus({ label: "Evening Window Active", color: "text-amber-400", activeCode: customerCodes.evening });
    } else {
      // Demo Override: Forces the morning code to be active so you can show it off anytime
      setTimeStatus({ label: "Demo Override: Market Open", color: "text-emerald-400", activeCode: customerCodes.morning });
    }
  }, [customerCodes]);

  // Authenticate the Telegram Code
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = codeInput.trim().toUpperCase();

    if (code === timeStatus.activeCode) {
      setIsVerified(true);
    } else {
      setError("Invalid or Expired Telegram Code");
      setTimeout(() => setCodeInput(""), 1500);
    }
  };

  const categorizedInventory = useMemo(() => {
    return inventory.reduce((acc: any, item: any) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [inventory]);

  const updateCart = (id: string, delta: number) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      return { ...prev, [id]: next };
    });
  };

  const cartTotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const item = inventory.find((i: any) => i.id === id);
    return total + ((item?.price || 0) * qty);
  }, 0);

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  // ========================================================
  // VIEW 1: THE STOREFRONT LOCK SCREEN (Telegram Code)
  // ========================================================
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
        <button onClick={onExit} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-500 flex items-center gap-2 transition-colors z-50">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Exit App</span>
        </button>
        
        <div className="absolute top-0 w-full h-1/2 bg-linear-to-b from-emerald-900/10 to-zinc-950 pointer-events-none"></div>
        
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-5 rounded-3xl mb-6 shadow-[0_0_30px_rgba(52,211,153,0.1)] border border-zinc-800">
            <Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </div>
          <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase drop-shadow-md">Member Market</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">Secure Telegram Access Required</p>

          <form onSubmit={handleAuth} className="w-full">
            <div className="relative mb-4">
              <input type="text" autoFocus value={codeInput} onChange={(e) => { setError(""); setCodeInput(e.target.value.toUpperCase()); }} placeholder="ENTER ACCESS CODE" className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 text-center text-xl tracking-[0.2em] font-black outline-none transition-all shadow-inner placeholder:text-zinc-700 placeholder:text-sm placeholder:font-bold ${error ? 'border-rose-500 text-rose-500 bg-rose-500/5 animate-shake' : 'border-zinc-800 text-emerald-400 focus:border-emerald-500/50'}`} />
              {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest">{error}</p>}
            </div>
            <button type="submit" disabled={!codeInput.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-6">
              Enter Market <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl">
            <Clock size={14} className={timeStatus.color} />
            <span className={`text-[10px] font-black uppercase tracking-widest ${timeStatus.color}`}>{timeStatus.label}</span>
          </div>
        </div>
      </div>
    );
  }

  // ========================================================
  // VIEW 2: CHECKOUT SCREEN
  // ========================================================
  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-emerald-400" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Order Transmitted</h2>
        <p className="text-zinc-400 mb-8 uppercase tracking-widest text-sm">Your order has been sent to dispatch.</p>
        <button onClick={() => { setCart({}); setIsCheckingOut(false); onExit(); }} className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-800 text-emerald-400 font-bold uppercase tracking-widest transition-colors">
          Exit Market
        </button>
      </div>
    );
  }

  // ========================================================
  // VIEW 3: THE STORE CATALOG
  // ========================================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative pb-32">
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="text-zinc-500 hover:text-rose-500 transition-colors p-2"><X size={20}/></button>
          <div className="flex items-center gap-2">
            <Package size={20} className="text-emerald-400" />
            <h1 className="font-black text-lg tracking-widest uppercase text-zinc-100 hidden sm:block">Member Market</h1>
          </div>
        </div>
        <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
          <ShoppingCart size={18} className="text-emerald-400" />
          <span className="font-black text-zinc-100">{cartItemCount} Items</span>
          <span className="text-emerald-400 font-mono font-bold border-l border-zinc-800 pl-3 ml-1">${cartTotal.toFixed(2)}</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-12">
        {Object.entries(categorizedInventory).map(([category, items]: [string, any]) => (
          <section key={category} className="animate-in fade-in slide-in-from-bottom-4">
            <h2 className="text-xl font-black text-emerald-400 uppercase tracking-[0.2em] mb-6 border-b border-zinc-800 pb-2 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item: any) => {
                const qty = cart[item.id] || 0;
                return (
                  <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-emerald-500/30 transition-colors shadow-lg flex flex-col justify-between">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-zinc-100 text-lg">{item.name}</h3>
                        <span className="font-mono text-emerald-400 font-bold">${item.price.toFixed(2)}</span>
                      </div>
                      <span className="text-xs font-bold text-zinc-500 bg-zinc-950 px-2 py-1 rounded border border-zinc-800 uppercase tracking-widest">{item.unit}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800">
                      {qty === 0 ? (
                        <button onClick={() => updateCart(item.id, 1)} className="w-full bg-zinc-800 hover:bg-emerald-500/20 text-emerald-400 border border-zinc-700 py-3 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2">
                          <Plus size={16} /> Add to Cart
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between bg-zinc-950 border border-emerald-500/30 rounded-xl p-1 shadow-inner">
                          <button onClick={() => updateCart(item.id, -1)} className="p-3 hover:bg-zinc-900 rounded-lg text-rose-400 transition-colors"><Minus size={18}/></button>
                          <span className="font-black text-xl text-emerald-400">{qty}</span>
                          <button onClick={() => updateCart(item.id, 1)} className="p-3 hover:bg-zinc-900 rounded-lg text-emerald-400 transition-colors"><Plus size={18}/></button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center animate-in slide-in-from-bottom-10">
          <button onClick={() => setIsCheckingOut(true)} className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105">
            <span>Checkout</span>
            <span className="bg-zinc-950 text-emerald-400 px-3 py-1 rounded-xl text-base">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}