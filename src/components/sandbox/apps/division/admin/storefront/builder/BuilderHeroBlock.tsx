import React from 'react';
import { Edit3 } from 'lucide-react';
import { IconMap, ThemeMap, getThemeColor } from '../StorefrontBuilder';

export default function BuilderHeroBlock({ homeConfig, openEdit }: any) {
    const heroTheme = ThemeMap[getThemeColor((homeConfig.hero as any).color || homeConfig.hero.colorFrom)] || ThemeMap['pink'];
    const HeroIcon = IconMap[homeConfig.hero.icon] || IconMap['Flame'];

    return (
        <div onClick={() => openEdit('hero', homeConfig.hero)} className={`cursor-pointer group relative w-full ${(homeConfig.hero as any).imgUrl ? 'bg-zinc-950' : heroTheme.heroGrad} rounded-3xl p-4 md:p-8 flex flex-col justify-end shadow-2xl overflow-hidden transition-all hover:ring-4 ring-white/20 h-100 md:h-125`}>
            {(homeConfig.hero as any).imgUrl ? (
            <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
                <img src={(homeConfig.hero as any).imgUrl} className={`w-full h-full object-cover opacity-30`} alt="Hero" />
                <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/60`} />
            </div>
            ) : (
            <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950"></div>
            </div>
            )}
            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center z-50 backdrop-blur-sm transition-all rounded-3xl">
                <span className="bg-zinc-900 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2"><Edit3 size={16}/> Edit Hero Banner</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center w-full h-full my-auto py-4 pointer-events-none">
                <div className="flex flex-col items-center text-center animate-[pulse_3s_ease-in-out_infinite] max-w-3xl mx-auto w-full transition-shadow duration-700">
                    <div className="relative mb-2">
                    <HeroIcon size={48} className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-bounce relative z-10" />
                    <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-50 rounded-full animate-pulse"></div>
                    </div>
                    <div className="space-y-1 md:space-y-2 w-full">
                        {/* NEON STROBE OUTLINE APPLIED HERE */}
                        {homeConfig.hero.title.split('\n').map((line: string, i: number) => (
                            <h2 key={i} className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-transparent ${i % 2 !== 0 ? '[-webkit-text-stroke:2px_var(--color-cyan-400)] drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]' : '[-webkit-text-stroke:2px_var(--color-pink-500)] drop-shadow-[0_0_20px_rgba(236,72,153,0.8)]'}`}>
                                {line}
                            </h2>
                        ))}
                    </div>
                    <p className="mt-6 text-pink-100 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                        {homeConfig.hero.subtitle}
                    </p>
                    <div className="mt-8 px-8 py-3 border-2 border-cyan-400 text-cyan-300 font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 hover:text-zinc-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all bg-zinc-950/40 backdrop-blur-sm">
                        <span className="relative z-10">{homeConfig.hero.buttonText}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}