import React from 'react';
import { Edit3 } from 'lucide-react';
import { IconMap, ThemeMap, getThemeColor } from '../StorefrontBuilder';

export default function BuilderSecondaryBlock({ homeConfig, openEdit }: any) {
    const secTheme = ThemeMap[getThemeColor((homeConfig.secondary as any).color || homeConfig.secondary.colorFrom)] || ThemeMap['emerald'];
    const SecIcon = IconMap[homeConfig.secondary.icon] || IconMap['Award'];

    return (
        <div onClick={() => openEdit('secondary', homeConfig.secondary)} className={`cursor-pointer group relative w-full h-62.5 md:h-75 ${secTheme.secBg} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all hover:ring-4 ring-white/20`}>
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center z-50 backdrop-blur-sm transition-all">
                <span className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"><Edit3 size={16}/> Edit Banner</span>
            </div>
            <div className="relative z-10 pointer-events-none my-auto">
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${secTheme.secText}`}>{homeConfig.secondary.subtitle}</p>
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6 whitespace-pre-line">{homeConfig.secondary.title}</h2>
                <button className={`bg-zinc-950 ${secTheme.secBtnText} px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg border border-zinc-800`}>{homeConfig.secondary.buttonText}</button>
            </div>
            <SecIcon size={140} className="text-white/5 absolute right-0 md:-right-4 top-1/2 -translate-y-1/2" />
        </div>
    );
}