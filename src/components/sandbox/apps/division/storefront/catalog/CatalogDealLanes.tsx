// sandbox/apps/storefront/catalog/CatalogDealLanes.tsx
import React from 'react';
import { Flame, Award, Wind, Zap, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { StorefrontCard } from '../StorefrontComponents';

export default function CatalogDealLanes({ recurringDeals, oneShotDeals, newDropsBucket, premiumWarehouseBucket, smokyStealsBucket, returnedBucket, vaultDropBucket, currentDayName, dayTitle, daySub, cart, updateCart, clientConfig }: any) {
    return (
        <>
            {/* 🚀 THE CHILL DROP: Fuchsia glow, centered if single item */}
            {vaultDropBucket && vaultDropBucket.length > 0 && (
                <div className="pt-2 animate-in fade-in slide-in-from-bottom-8 mt-6 mb-4 relative overflow-hidden bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-[2.5rem] p-6 sm:p-8 shadow-[0_0_50px_rgba(217,70,239,0.15)]">
                    <div className="absolute top-0 left-0 w-full h-full bg-fuchsia-500/5 blur-3xl rounded-full animate-pulse" />
                    
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10 border-b border-fuchsia-500/30 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-fuchsia-500 rounded-2xl shadow-[0_0_30px_rgba(217,70,239,0.6)] text-zinc-950">
                                <Flame size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-fuchsia-400 drop-shadow-md">
                                    The Backroom Stash
                                </h3>
                                <p className="text-xs font-black text-fuchsia-500/80 uppercase tracking-widest mt-1">
                                    Ugly buds. Beautiful highs. Grab 'em while they last.
                                </p>
                            </div>
                        </div>
                        <div className="bg-zinc-950 border border-fuchsia-500 text-fuchsia-400 px-6 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(217,70,239,0.3)]">
                           <Sparkles size={16} className="animate-pulse" /> Live Drop
                        </div>
                    </div>

                    {/* Auto-centers if there's only 1 item in the stash */}
                    <div className={vaultDropBucket.length === 1 ? "flex justify-center relative z-10" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"}>
                        {vaultDropBucket.map((item: any) => (
                            <div key={item.id} className={vaultDropBucket.length === 1 ? "w-full max-w-md" : ""}>
                                <StorefrontCard item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {recurringDeals.length > 0 && (
                <div id="recurring-deals-section" className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-6 border-t border-zinc-800/50 scroll-mt-24 relative overflow-hidden">
                   <div className="absolute top-0 left-1/4 w-1/3 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center gap-6 mb-8 pt-6 relative z-10 pl-2">
                     <div className="shrink-0 border-[3px] border-rose-500 text-rose-500 px-3 py-1 rounded-md transform -rotate-12 shadow-[0_0_15px_rgba(244,63,94,0.4)] bg-zinc-950/80 backdrop-blur-sm relative">
                       <span className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] leading-none block pt-1">{currentDayName}</span>
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-violet-500 via-indigo-400 to-cyan-400">{dayTitle}</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{daySub}</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {recurringDeals.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
            )}

            {oneShotDeals.length > 0 && (
                <div id="live-deals-section" className="pt-8 animate-in fade-in slide-in-from-bottom-8 mt-6 border-t border-zinc-800/50 scroll-mt-24 relative overflow-hidden">
                   <div className="absolute top-0 right-1/4 w-1/3 h-32 bg-orange-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)]"><Flame size={24} className="text-orange-400 animate-bounce" /></div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-orange-400 to-yellow-400">Live Right Now</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Active daily flash promos.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {oneShotDeals.map((item: any, idx: number) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} isHero={idx === 0} />)}
                   </div>
                </div>
            )}

            {newDropsBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50 relative overflow-hidden">
                   <div className="flex items-center justify-between mb-8 pt-6 relative z-10">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/40"><Zap size={24} className="text-cyan-400 animate-pulse" /></div>
                       <div>
                         <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-400">New Arrivals</h3>
                         <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1 hidden sm:block">Fresh drops hitting the Warehouse.</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-900/80 px-4 py-2 rounded-full border border-zinc-800">
                       Swipe <ArrowRight size={12} />
                     </div>
                   </div>
                   <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 relative z-10">
                     {newDropsBucket.map((item: any) => (
                       <div key={item.id} className="snap-start shrink-0 w-[85vw] sm:w-85"><StorefrontCard item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} /></div>
                     ))}
                   </div>
                </div>
            )}

            {returnedBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50 relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-lime-500/10 rounded-2xl border border-lime-500/40"><RotateCcw size={24} className="text-lime-400" /></div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-green-500 via-lime-400 to-emerald-400">Back In The Warehouse</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Returned by popular demand.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {returnedBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
            )}

            {smokyStealsBucket.length > 0 && (
                <div className="pt-8 animate-in fade-in mt-8 border-t border-zinc-800/50 relative overflow-hidden">
                 <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-lime-500/5 blur-3xl rounded-full animate-pulse" />
                 <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-zinc-950 rounded-2xl border border-dashed border-lime-500/50 relative overflow-hidden group">
                       <Wind size={24} className="text-lime-400 relative z-10 animate-pulse" />
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-zinc-500 via-lime-400 to-zinc-400">Smoky Steals</h3>
                       <p className="text-xs font-bold text-lime-400 uppercase tracking-widest mt-1">While supplies last, don't miss out on these Smoky Steals!</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {smokyStealsBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
            )}

            {premiumWarehouseBucket.length > 0 && (
                <div className="pt-8 animate-in fade-in mt-8 border-t border-zinc-800/50 relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/40"><Award size={24} className="text-amber-400" /></div>
                    <div> 
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-yellow-500 via-amber-400 to-amber-200">The Premium Warehouse</h3> 
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Exclusive Top Shelf Selections</p> 
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                   {premiumWarehouseBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                 </div>
               </div>
            )}
        </>
    );
}