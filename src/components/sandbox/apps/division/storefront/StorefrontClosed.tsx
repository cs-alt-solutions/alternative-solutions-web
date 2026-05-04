import React from 'react';
import { Clock, Unlock, ArrowRight } from 'lucide-react';

export default function StorefrontClosed({ showBypass, setShowBypass, bypassCode, setBypassCode, handleBypass, storeHours }: any) {
  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 text-center">
        
        <button 
          onClick={() => setShowBypass(!showBypass)} 
          className="bg-zinc-900 p-6 rounded-full mb-6 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50 transition-colors focus:outline-none"
        >
          {showBypass ? <Unlock size={48} className="text-amber-500" /> : <Clock size={48} className="text-zinc-500" />}
        </button>
        
        <h1 className="text-3xl font-black tracking-widest mb-2 uppercase text-zinc-100">Market Closed</h1>
        <p className="text-sm font-bold text-zinc-500 mb-8 max-w-xs">The Warehouse is sealed for the day. Please check back tomorrow when the market reopens.</p>
        
        {showBypass ? (
          <div className="w-full animate-in slide-in-from-top-4 fade-in duration-300">
             <div className="flex gap-2 mb-2">
               <input 
                 type="password" 
                 value={bypassCode} 
                 onChange={(e) => setBypassCode(e.target.value)} 
                 onKeyDown={(e) => { if (e.key === 'Enter') handleBypass(); }}
                 placeholder="OVERRIDE CODE" 
                 autoFocus
                 className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center text-sm font-black tracking-widest text-amber-400 outline-none focus:border-amber-500/50 transition-colors placeholder:text-zinc-700" 
               />
               <button onClick={handleBypass} className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-4 rounded-xl font-black transition-colors">
                 <ArrowRight size={20} />
               </button>
             </div>
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 px-6 py-4 rounded-xl flex flex-col items-center w-full">
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Operating Hours</span>
             <span className="text-sm font-mono text-zinc-400">{storeHours.open} - {storeHours.close}</span>
          </div>
        )}
      </div>
    </div>
  );
}