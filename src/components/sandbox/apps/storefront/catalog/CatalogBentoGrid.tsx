import React from 'react';
import { IconMap, ThemeMap, getThemeColor, getSmartBentoSpan } from '../../admin/storefront/StorefrontBuilder';

export default function CatalogBentoGrid({ homeConfig, setActiveCategory, setActiveSubCategory }: any) {
    if (!homeConfig?.bento || homeConfig.bento.length === 0) return null;

    return (
        <div className="pt-4">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-6 text-center">Shop By Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[160px] md:auto-rows-[180px]">
                {homeConfig.bento.map((c: any, idx: number) => {
                    const BIcon = IconMap[c.icon] || IconMap['Tag'];
                    const sanitizedSpan = getSmartBentoSpan(idx, homeConfig.bento.length);
                    const theme = ThemeMap[getThemeColor(c.color)] || ThemeMap['emerald'];
                    const displayImg = c.imgUrl || homeConfig.categoryImages?.[c.cat] || null;

                    return (
                        <button 
                            key={idx}
                            onClick={() => {
                                setActiveCategory(c.cat);
                                if (c.sub) setActiveSubCategory(c.sub);
                                else setActiveSubCategory('All');
                            }}
                            className={`rounded-3xl p-6 flex flex-col items-start justify-end gap-1 ${theme.bentoHover} transition-all group relative overflow-hidden ${sanitizedSpan} bg-zinc-950 border-2 border-zinc-800 shadow-lg`}
                        >
                            {displayImg ? (
                                <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700">
                                    <img src={displayImg} alt={c.name} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                                    <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40`} />
                                    <div className={`absolute inset-0 bg-linear-to-t ${theme.bentoOverlay} opacity-30`} />
                                </div>
                            ) : (
                                <div className={`absolute inset-0 z-0 ${theme.bentoFallback} group-hover:scale-105 transition-transform duration-700`} />
                            )}
                            <div className="relative z-10 w-full flex flex-col items-start">
                                <div className={`p-3 rounded-xl border border-zinc-800/50 mb-4 group-hover:scale-110 transition-transform bg-zinc-950/80 ${theme.bentoIconText}`}>
                                    <BIcon size={24} />
                                </div>
                                <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-zinc-100 drop-shadow-md">{c.name}</span>
                                <p className={`text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed text-left ${(sanitizedSpan.includes('row-span-2') ? '' : 'hidden md:block')}`}>
                                    {c.desc}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}