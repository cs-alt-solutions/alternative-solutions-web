import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IconMap, ThemeMap } from '../../admin/storefront/StorefrontBuilder';

export default function CatalogHeroCarousel({ heroSlides, heroIndex, setHeroIndex }: any) {
    const slideCount = heroSlides.length;
    const activeHero = heroSlides[heroIndex] || heroSlides[0];
    const activeTheme = ThemeMap[activeHero.themeColor] || ThemeMap['cyan'];
    const ActiveHeroIcon = IconMap[activeHero.icon] || IconMap['Flame'];
    const isMasterSlide = heroIndex === 0;

    const nextSlide = (e: React.MouseEvent) => { e.stopPropagation(); setHeroIndex((prev: number) => (prev + 1) % slideCount); };
    const prevSlide = (e: React.MouseEvent) => { e.stopPropagation(); setHeroIndex((prev: number) => (prev - 1 + slideCount) % slideCount); };

    return (
        <div onClick={activeHero.action} className={`w-full ${activeHero.imgUrl ? 'bg-zinc-950' : activeTheme.heroGrad} cursor-pointer rounded-3xl ${isMasterSlide ? 'p-4 md:p-8' : 'p-8 md:p-12'} flex flex-col justify-end shadow-2xl overflow-hidden relative group transition-all duration-700 h-100 md:h-125`}>
            {activeHero.imgUrl ? (
                <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000">
                    <img src={activeHero.imgUrl} className={`w-full h-full object-cover ${isMasterSlide ? 'opacity-30' : 'opacity-90'}`} alt="Deal" />
                    <div className={`absolute inset-0 bg-linear-to-t ${isMasterSlide ? 'from-zinc-950 via-zinc-950/80 to-zinc-950/60' : 'from-zinc-950/90 via-zinc-950/20 to-transparent'}`} />
                </div>
            ) : (
                <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000">
                    {isMasterSlide && (
                        <>
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                        <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950"></div>
                        </>
                    )}
                </div>
            )}
            
            {isMasterSlide ? (
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full my-auto py-4 pointer-events-none">
                    <div className="flex flex-col items-center text-center animate-[pulse_3s_ease-in-out_infinite] max-w-3xl mx-auto w-full">
                        <div className="relative mb-2">
                            <ActiveHeroIcon size={48} className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-bounce relative z-10" />
                            <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-50 rounded-full animate-pulse"></div>
                        </div>
                        <div className="space-y-1 md:space-y-2 w-full">
                            {activeHero.title?.split('\n').map((line: string, i: number) => (
                                <h2 key={i} className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none ${i % 2 !== 0 ? 'text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)]' : 'text-pink-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]'}`}>{line}</h2>
                            ))}
                        </div>
                        <p className="mt-6 text-pink-100 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">{activeHero.subtitle}</p>
                        <div className="mt-8 px-8 py-3 border-2 border-cyan-400 text-cyan-300 font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 hover:text-zinc-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all pointer-events-auto bg-zinc-950/40 backdrop-blur-sm">
                            <span className="relative z-10">{activeHero.buttonText}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between w-full mt-auto gap-6 pointer-events-none">
                    <div>
                        <div key={`title-${heroIndex}`} className="flex flex-col gap-1 mb-2 animate-in slide-in-from-left-4 fade-in duration-500">
                            {activeHero.title?.split('\n').map((line: string, i: number) => (
                                <h2 key={i} className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none ${i % 2 !== 0 ? 'text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]' : 'text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]'}`}>{line}</h2>
                            ))}
                        </div>
                        <p key={`sub-${heroIndex}`} className={`text-sm md:text-xl font-black uppercase tracking-widest mb-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] animate-in slide-in-from-left-4 fade-in duration-500 delay-75 text-white`}>{activeHero.subtitle}</p>
                    </div>
                    <button key={`btn-${heroIndex}`} className="shrink-0 bg-zinc-950/90 backdrop-blur-md text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-4 fade-in border border-zinc-800 pointer-events-auto">{activeHero.buttonText}</button>
                    {!activeHero.imgUrl && <ActiveHeroIcon key={`icon-${heroIndex}`} size={180} className="text-white/10 absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 rotate-12 group-hover:scale-110 transition-transform duration-700 animate-in fade-in" />}
                </div>
            )}
            
            {slideCount > 1 && (
                <>
                <button onClick={prevSlide} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-950/60 backdrop-blur-md text-white rounded-full hover:bg-zinc-900 border border-zinc-700/50 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"><ChevronLeft size={24} /></button>
                <button onClick={nextSlide} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-950/60 backdrop-blur-md text-white rounded-full hover:bg-zinc-900 border border-zinc-700/50 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl"><ChevronRight size={24} /></button>
                <div className="absolute top-6 right-6 flex items-center gap-2 z-20 bg-zinc-950/50 backdrop-blur-md px-3 py-2 rounded-full border border-zinc-800/50 pointer-events-auto">
                    {heroSlides.map((_: any, i: number) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/30 hover:bg-white/70'}`} />
                    ))}
                </div>
                </>
            )}
        </div>
    );
}