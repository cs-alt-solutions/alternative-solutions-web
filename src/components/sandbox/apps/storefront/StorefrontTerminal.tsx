/* src/components/sandbox/apps/storefront/StorefrontTerminal.tsx */
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, CheckCircle, Package, Lock, Clock, ArrowRight, Leaf, Flame, Box, Image as ImageIcon } from 'lucide-react';

// ==========================================
// SUB-COMPONENT: 3D FLIPPING PRODUCT CARD
// ==========================================
const StorefrontCard = ({ item, cart, updateCart }: { item: any, cart: any, updateCart: (itemId: string, variant: any, delta: number) => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(item.variants[0]);
  
  // Dynamic Icon
  const Icon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
  
  // Track qty for this specific variant
  const cartKey = `${item.id}_${selectedVariant.id}`;
  const qty = cart[cartKey]?.qty || 0;

  return (
    <div className="group relative w-full h-[400px] perspective-[1000px]">
      <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        
        {/* FRONT OF CARD */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg flex flex-col items-center">
          <div className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4 flex items-center justify-center text-zinc-800 shadow-inner overflow-hidden relative group-hover:border-emerald-500/30 transition-colors">
             <Icon size={64} className="opacity-50" />
             <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent opacity-80" />
             <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-900/50">
               Starts at ${item.variants[0].price.toFixed(2)}
             </span>
          </div>
          <h3 className="font-black text-zinc-100 text-xl tracking-tight text-center mb-1 w-full truncate">{item.name}</h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-auto">{item.category}</p>
          
          <button 
            onClick={() => setIsFlipped(true)} 
            className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 py-3 rounded-xl font-black uppercase tracking-widest transition-all"
          >
            Select Options
          </button>
        </div>

        {/* BACK OF CARD (FLIPPED) */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-zinc-900 border border-emerald-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(52,211,153,0.1)] flex flex-col">
          <div className="flex justify-between items-start mb-4">
             <h3 className="font-black text-zinc-100 text-lg leading-tight">{item.name}</h3>
             <button onClick={() => setIsFlipped(false)} className="text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-950 p-1.5 rounded-full border border-zinc-800"><X size={16} /></button>
          </div>
          
          <p className="text-xs text-zinc-400 font-medium leading-relaxed mb-4 flex-1 line-clamp-3">
            {item.description}
          </p>

          <div className="space-y-3 mb-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Select Weight / Variant</label>
            <div className="grid grid-cols-2 gap-2">
              {item.variants.map((v: any) => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all border ${selectedVariant.id === v.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}
                >
                  <div className="truncate">{v.label}</div>
                  <div className="font-mono mt-1">${v.price.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-800">
            {qty === 0 ? (
              <button onClick={() => updateCart(item.id, selectedVariant, 1)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-3 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <Plus size={16} /> Add to Cart
              </button>
            ) : (
              <div className="w-full flex items-center justify-between bg-zinc-950 border border-emerald-500/30 rounded-xl p-1 shadow-inner">
                <button onClick={() => updateCart(item.id, selectedVariant, -1)} className="p-3 hover:bg-zinc-900 rounded-lg text-rose-400 transition-colors"><Minus size={18}/></button>
                <div className="flex flex-col items-center">
                  <span className="font-black text-xl text-emerald-400 leading-none">{qty}</span>
                  <span className="text-[9px] font-mono text-emerald-400/50 uppercase">In Cart</span>
                </div>
                <button onClick={() => updateCart(item.id, selectedVariant, 1)} className="p-3 hover:bg-zinc-900 rounded-lg text-emerald-400 transition-colors"><Plus size={18}/></button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// MAIN TERMINAL APP
// ==========================================
export default function StorefrontTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const [isVerified, setIsVerified] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [error, setError] = useState("");
  const [timeStatus, setTimeStatus] = useState({ label: "Checking Time...", color: "text-zinc-500", activeCode: "" });

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<Record<string, { item: any, variant: any, qty: number }>>({});
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const inventory = clientConfig.inventory;
  const customerCodes = clientConfig.security?.customerCodes || { morning: "WAKE", evening: "BAKE" };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 8 && hour < 12) {
      setTimeStatus({ label: "Morning Window Active", color: "text-emerald-400", activeCode: customerCodes.morning });
    } else if (hour >= 12 && hour < 17) {
      setTimeStatus({ label: "Evening Window Active", color: "text-amber-400", activeCode: customerCodes.evening });
    } else {
      setTimeStatus({ label: "Demo Override: Market Open", color: "text-emerald-400", activeCode: customerCodes.morning });
    }
  }, [customerCodes]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const code = codeInput.trim().toUpperCase();
    if (code === timeStatus.activeCode) setIsVerified(true);
    else { setError("Invalid or Expired Code"); setTimeout(() => setCodeInput(""), 1500); }
  };

  const categories = useMemo(() => ['All', ...Array.from(new Set(inventory.map((i: any) => i.category)))], [inventory]);
  
  const filteredInventory = useMemo(() => {
    if (activeCategory === 'All') return inventory;
    return inventory.filter((i: any) => i.category === activeCategory);
  }, [inventory, activeCategory]);

  const updateCart = (itemId: string, variant: any, delta: number) => {
    setCart(prev => {
      const cartKey = `${itemId}_${variant.id}`;
      const item = inventory.find((i: any) => i.id === itemId);
      const current = prev[cartKey]?.qty || 0;
      const next = Math.max(0, current + delta);
      
      if (next === 0) {
        const newCart = { ...prev };
        delete newCart[cartKey];
        return newCart;
      }
      return { ...prev, [cartKey]: { item, variant, qty: next } };
    });
  };

  const cartTotal = Object.values(cart).reduce((total, { variant, qty }) => total + (variant.price * qty), 0);
  const cartItemCount = Object.values(cart).reduce((total, { qty }) => total + qty, 0);

  // VIEW 1: LOCK SCREEN
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
        <button onClick={onExit} className="absolute top-6 left-6 text-zinc-500 hover:text-rose-500 flex items-center gap-2 transition-colors z-50">
          <X size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Exit App</span>
        </button>
        <div className="absolute top-0 w-full h-1/2 bg-linear-to-b from-emerald-900/10 to-zinc-950 pointer-events-none"></div>
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-5 rounded-3xl mb-6 shadow-[0_0_30px_rgba(52,211,153,0.1)] border border-zinc-800"><Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" /></div>
          <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase drop-shadow-md">Division Access</h1>
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

  // VIEW 2: CHECKOUT SCREEN
  if (isCheckingOut) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6"><CheckCircle size={48} className="text-emerald-400" /></div>
        <h2 className="text-3xl font-black uppercase tracking-widest mb-4">Order Transmitted</h2>
        <p className="text-zinc-400 mb-8 uppercase tracking-widest text-sm">Your order has been sent to dispatch.</p>
        <button onClick={() => { setCart({}); setIsCheckingOut(false); onExit(); }} className="bg-zinc-900 border border-zinc-700 px-6 py-3 rounded-xl hover:bg-zinc-800 text-emerald-400 font-bold uppercase tracking-widest transition-colors">Exit Market</button>
      </div>
    );
  }

  // VIEW 3: THE CATALOG
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative pb-32 selection:bg-emerald-500/30">
      
      {/* Top Header */}
      <header className="bg-zinc-950 border-b border-zinc-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full mb-4">
          <div className="flex items-center gap-3">
            <button onClick={onExit} className="text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-900 p-2 rounded-full border border-zinc-800"><X size={18}/></button>
            <div className="flex items-center gap-2">
              <Package size={20} className="text-emerald-400" />
              <h1 className="font-black text-lg tracking-widest uppercase text-zinc-100 hidden sm:block">Division Market</h1>
            </div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
            <ShoppingCart size={18} className="text-emerald-400" />
            <span className="font-black text-zinc-100">{cartItemCount} Items</span>
            <span className="text-emerald-400 font-mono font-bold border-l border-zinc-800 pl-3 ml-1">${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Sticky Category Nav */}
        <div className="max-w-6xl mx-auto w-full overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 pb-2">
            {categories.map((cat: any) => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full font-black text-xs uppercase tracking-widest transition-all shrink-0 ${activeCategory === cat ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.3)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((item: any) => (
              <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} />
            ))}
         </div>
      </main>

      {/* Floating Checkout Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-50 flex justify-center animate-in slide-in-from-bottom-10">
          <button onClick={() => setIsCheckingOut(true)} className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400">
            <span>Review & Checkout</span>
            <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}