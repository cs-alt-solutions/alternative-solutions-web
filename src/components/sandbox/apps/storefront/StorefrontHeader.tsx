import React, { useState } from 'react';
import { ShoppingCart, Flame, LayoutGrid, Tag, Leaf, Wind, Cookie, Droplet, Shirt, Menu, Info, Home, X, Activity } from 'lucide-react';

export default function StorefrontHeader({
  cartItemCount, cartTotal, activeCategory, setActiveCategory, categories, timeData, setIsCheckingOut, setShowPolicies
}: any) {
  const safeCategories = categories || [];
  const filteredCategories = [
    'Home', 
    ...safeCategories.filter((c: string) => c !== 'Daily Deals' && c !== 'All') 
  ];

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderCategoryButton = (cat: string) => {
    const isActive = activeCategory === cat;
               
    let Icon = Tag;
    let iconColor = "text-zinc-500";
    let activeBg = 'bg-linear-to-r from-emerald-400 to-emerald-600 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.4)] border-transparent';
    let inactiveBg = 'bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700';

    if (cat === 'Home') {
      Icon = Home; 
      iconColor = "text-pink-500";
      if (isActive) activeBg = 'bg-linear-to-r from-pink-400 to-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-transparent';
    } else if (cat === 'All') {
      Icon = LayoutGrid;
      iconColor = "text-emerald-500";
    } else if (cat === 'Flower & Plants') {
      Icon = Leaf;
      iconColor = "text-emerald-400";
    } else if (cat === 'Vapes & Pens') {
      Icon = Wind;
      iconColor = "text-cyan-400";
      if (isActive) activeBg = 'bg-linear-to-r from-cyan-400 to-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.4)] border-transparent';
    } else if (cat === 'Edibles') {
      Icon = Cookie;
      iconColor = "text-amber-400";
      if (isActive) activeBg = 'bg-linear-to-r from-amber-400 to-orange-500 text-zinc-950 shadow-[0_0_15px_rgba(251,191,36,0.4)] border-transparent';
    } else if (cat === 'Concentrates') {
      Icon = Droplet;
      iconColor = "text-orange-500";
      if (isActive) activeBg = 'bg-linear-to-r from-orange-400 to-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(249,115,22,0.4)] border-transparent';
    } else if (cat === 'Healthcare & Topicals') {
      Icon = Activity;
      iconColor = "text-rose-400";
      if (isActive) activeBg = 'bg-linear-to-r from-rose-400 to-pink-600 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.4)] border-transparent';
    } else if (cat === 'Merch & Extras') {
      Icon = Shirt;
      iconColor = "text-fuchsia-400";
      if (isActive) activeBg = 'bg-linear-to-r from-fuchsia-400 to-purple-600 text-zinc-950 shadow-[0_0_15px_rgba(217,70,239,0.4)] border-transparent';
    }

    return (
      <button 
        key={`btn-menu-${cat}`}
        onClick={() => {
          setActiveCategory(cat);
          setIsMenuOpen(false);
        }}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive ? activeBg : inactiveBg}`}
      >
        <div className="flex items-center gap-3">
          <Icon size={16} className={isActive ? "text-zinc-950" : iconColor} /> 
          {cat}
        </div>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-sm" />}
      </button>
    );
  };

  return (
    <>
      <div className="bg-indigo-500 text-zinc-950 flex items-center justify-center py-2 px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest z-60 relative shadow-md">
        Spend over $200 get 10% off! Free shipping on orders above $150
      </div>
      
      <header className="bg-zinc-950 border-b border-zinc-800 pt-4 pb-4 sticky top-0 z-50 shadow-md">
        <div className="flex justify-between items-center max-w-6xl mx-auto w-full px-4">
          
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 ${isMenuOpen ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 hover:border-zinc-700'}`}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20 hidden sm:block">
                <Leaf size={18} className="text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-[15px] sm:text-lg tracking-widest uppercase text-zinc-100 leading-none">The Doobie Division</h1>
                <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1 opacity-80">Powered by Alternative Solutions</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest font-mono hidden md:block border-r border-zinc-800 pr-4">
                SHIFT {timeData?.shiftCode || 'A'}
             </div>
             
             <button onClick={() => setIsCheckingOut && setIsCheckingOut(true)} className="bg-zinc-900 border border-zinc-800 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center gap-3 shadow-inner hover:bg-zinc-800 transition-colors group">
               <ShoppingCart size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
               <span className="font-black text-zinc-100 hidden sm:block">{cartItemCount || 0} Items</span>
               <span className="text-emerald-400 font-mono font-bold sm:border-l sm:border-zinc-800 sm:pl-3 sm:ml-1">${(cartTotal || 0).toFixed(2)}</span>
             </button>
          </div>
        </div>

        {/* UNIFIED APP DRAWER */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full sm:w-80 bg-zinc-950/95 backdrop-blur-xl border-b sm:border-r border-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col max-h-[80vh] overflow-y-auto animate-in slide-in-from-top-2 sm:slide-in-from-left-2">
            <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/30">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Explore Categories</span>
            </div>
            <div className="p-3 flex flex-col gap-1.5">
              {filteredCategories.map((cat: string) => renderCategoryButton(cat))}
            </div>
            
            <div className="border-t border-zinc-800/80 p-3 mt-2">
              <button 
                onClick={() => { setShowPolicies && setShowPolicies(true); setIsMenuOpen(false); }} 
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              >
                <Info size={16} className="text-zinc-500" /> Store Policies
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}