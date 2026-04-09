import React, { useState } from 'react';
import { Package, ShoppingCart, Flame, LayoutGrid, Tag, Leaf, Wind, Cookie, Droplet, Shirt, Menu, ChevronDown } from 'lucide-react';

export default function StorefrontHeader({
  cartItemCount, cartTotal, activeCategory, setActiveCategory, categories, timeData, setIsCheckingOut
}: any) {
  const safeCategories = categories || [];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderCategoryButton = (cat: string, isMobile: boolean) => {
    const isActive = activeCategory === cat;
               
    let Icon = Tag;
    let iconColor = "text-zinc-500";
    let activeBg = 'bg-linear-to-r from-emerald-400 to-emerald-600 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.4)] border-transparent';
    let inactiveBg = 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100';

    if (cat === 'Daily Deals') {
      Icon = Flame;
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
    } else if (cat === 'Merch & Extras') {
      Icon = Shirt;
      iconColor = "text-fuchsia-400";
      if (isActive) activeBg = 'bg-linear-to-r from-fuchsia-400 to-purple-600 text-zinc-950 shadow-[0_0_15px_rgba(217,70,239,0.4)] border-transparent';
    }

    return (
      <button 
        key={`btn-${isMobile ? 'mob' : 'desk'}-${cat}`}
        onClick={() => {
          setActiveCategory(cat);
          if (isMobile) setIsMenuOpen(false);
        }}
        className={`${isMobile ? 'w-full flex items-center justify-between px-5 py-4' : 'shrink-0 flex items-center gap-2 px-4 py-2.5'} rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive ? activeBg : inactiveBg}`}
      >
        <div className="flex items-center gap-2">
          <Icon size={isMobile ? 16 : 14} className={isActive ? "text-zinc-950" : iconColor} /> 
          {cat}
        </div>
        {isMobile && isActive && <div className="w-1.5 h-1.5 rounded-full bg-zinc-950 shadow-sm" />}
      </button>
    );
  };

  return (
    <header className="bg-zinc-950 border-b border-zinc-800 pt-4 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full px-4 mb-4 md:mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-emerald-400" />
            <div className="hidden sm:flex flex-col">
              <h1 className="font-black text-lg tracking-widest uppercase text-zinc-100 leading-none">Division Market</h1>
              <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 mt-1">Powered by Alternative Solutions</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono hidden md:block">
              SHIFT {timeData?.shiftCode || 'A'}
           </div>
           
           <button onClick={() => setIsCheckingOut && setIsCheckingOut(true)} className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner hover:bg-zinc-800 transition-colors">
             <ShoppingCart size={18} className="text-emerald-400" />
             <span className="font-black text-zinc-100">{cartItemCount || 0} Items</span>
             <span className="text-emerald-400 font-mono font-bold border-l border-zinc-800 pl-3 ml-1">${(cartTotal || 0).toFixed(2)}</span>
           </button>
        </div>
      </div>

      <div className="md:hidden max-w-6xl mx-auto w-full px-4 pb-4">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-4 py-3.5 rounded-2xl flex items-center justify-between transition-all active:scale-95 shadow-inner"
        >
          <div className="flex items-center gap-3">
            <Menu size={16} className="text-zinc-400" />
            <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
               <span className="text-zinc-600">Category:</span> <span className="text-emerald-400">{activeCategory}</span>
            </span>
          </div>
          <ChevronDown size={16} className={`text-zinc-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="hidden md:block max-w-6xl mx-auto w-full px-4 pb-3">
         <div className="flex items-center gap-2 border-b border-zinc-900 pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {safeCategories.map((cat: string) => renderCategoryButton(cat, false))}
         </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-50 px-4 py-4 flex flex-col gap-2 max-h-[60vh] overflow-y-auto animate-in slide-in-from-top-2">
          {safeCategories.map((cat: string) => renderCategoryButton(cat, true))}
        </div>
      )}
    </header>
  );
}