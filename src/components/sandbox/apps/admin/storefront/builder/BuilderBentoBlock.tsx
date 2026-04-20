import React from 'react';
import { Edit3, ArrowLeft, ArrowRight, Trash2, Plus } from 'lucide-react';
import { IconMap, ThemeMap, getThemeColor, getSmartBentoSpan } from '../StorefrontBuilder';

export default function BuilderBentoBlock({ homeConfig, openEdit, moveBento, removeBento, addBento }: any) {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 pointer-events-none">Shop By Categories</h3>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1 rounded-full">{homeConfig.bento.length} / 6 Active</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[160px] md:auto-rows-[180px]">
                {homeConfig.bento.map((c: any, idx: number) => {
                    const BIcon = IconMap[c.icon] || IconMap['Tag'];
                    const sanitizedSpan = getSmartBentoSpan(idx, homeConfig.bento.length);
                    const theme = ThemeMap[getThemeColor(c.color)] || ThemeMap['emerald'];
                    const displayImg = c.imgUrl || homeConfig.categoryImages?.[c.cat] || null;

                    return (
                        <div key={idx} className={`group relative overflow-hidden ${sanitizedSpan} bg-zinc-950 border-2 border-zinc-800 shadow-lg rounded-3xl p-6 flex flex-col items-start justify-end gap-1 ${theme.bentoHover} transition-all`}>
                            <div className="absolute inset-0 bg-black/60 hidden group-hover:flex flex-col items-center justify-center z-50 backdrop-blur-sm transition-all gap-3">
                                <button onClick={(e) => { e.stopPropagation(); openEdit(`bento-${idx}`, c); }} className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors"><Edit3 size={14}/> Edit Content</button>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); moveBento(idx, -1); }} disabled={idx === 0} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-white disabled:opacity-30 transition-colors"><ArrowLeft size={16}/></button>
                                    <button onClick={(e) => { e.stopPropagation(); moveBento(idx, 1); }} disabled={idx === homeConfig.bento.length - 1} className="p-2.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg text-white disabled:opacity-30 transition-colors"><ArrowRight size={16}/></button>
                                    {homeConfig.bento.length > 4 && (
                                    <button onClick={(e) => { e.stopPropagation(); removeBento(idx); }} className="p-2.5 bg-rose-500 hover:bg-rose-400 rounded-lg text-white transition-colors ml-2"><Trash2 size={16}/></button>
                                    )}
                                </div>
                            </div>
                            {displayImg ? (
                            <div className="absolute inset-0 z-0">
                                <img src={displayImg} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                                <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40`} />
                                <div className={`absolute inset-0 bg-linear-to-t ${theme.bentoOverlay} opacity-30`} />
                            </div>
                            ) : (
                            <div className={`absolute inset-0 z-0 ${theme.bentoFallback}`} />
                            )}
                            <div className="relative z-10 w-full flex flex-col items-start pointer-events-none">
                                <div className={`p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/50 mb-4 ${theme.bentoIconBg} ${theme.bentoIconText}`}>
                                    <BIcon size={24} />
                                </div>
                                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-zinc-100 drop-shadow-md">{c.name}</span>
                                <p className={`text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed text-left ${(sanitizedSpan.includes('row-span-2') ? '' : 'hidden md:block')}`}>
                                    {c.desc}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {homeConfig.bento.length < 6 && (
                    <button onClick={addBento} className="col-span-1 md:col-span-1 md:row-span-1 border-2 border-dashed border-zinc-700 rounded-3xl flex flex-col items-center justify-center text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group min-h-40">
                        <div className="p-3 bg-zinc-900 rounded-full group-hover:bg-cyan-500/20 transition-colors mb-2"><Plus size={24}/></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Add Category</span>
                    </button>
                )}
            </div>
        </div>
    );
}