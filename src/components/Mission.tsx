/* src/components/Mission.tsx */
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ChevronRight } from 'lucide-react';

export default function Mission() {
  const [imgError, setImgError] = useState(false);
  const { ORIGIN_STORY } = WEBSITE_COPY;

  return (
    <section id="origin" className="py-24 lg:py-40 px-6 relative bg-bg-app border-y border-white/5 overflow-hidden">
      {/* Subtle background glow to anchor the section */}
      <div className="absolute top-1/2 left-1/4 w-125 h-125 bg-brand-primary/10 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0 items-center">

          {/* 1. CHARACTER SIDE */}
          {/* Changed lg:-mr-20 to lg:-mr-40 to pull her much closer to the text */}
          <div className="relative flex justify-center lg:justify-end order-2 lg:order-1 lg:-mr-40 z-30">
            <div className="relative w-full max-w-md lg:max-w-xl h-125 lg:h-187.5">
               {/* Grounding Shadow */}
               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-black blur-[20px] rounded-[100%] z-0" />

               <Image
                 src="/caricature.png"
                 alt="The Architect"
                 fill
                 priority
                 sizes="(max-width: 768px) 100vw, 600px"
                 className={`object-contain object-bottom origin-bottom scale-110 lg:scale-125 relative z-10 drop-shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-transform duration-700 hover:scale-[1.3] ${imgError ? 'hidden' : 'opacity-100'}`}
                 onError={() => setImgError(true)}
               />

               {/* Fallback State */}
               <div className={`absolute inset-0 flex-col items-center justify-center text-brand-primary/40 ${imgError ? 'flex' : 'hidden'}`}>
                  <div className="w-20 h-20 border-2 border-current rounded-full flex items-center justify-center mb-4 bg-black/50 backdrop-blur-md">
                    <span className="font-mono text-2xl tracking-widest">{ORIGIN_STORY.FALLBACK.INITIALS}</span>
                  </div>
               </div>
            </div>
          </div>

          {/* 2. TEXT SIDE */}
          <div className="space-y-8 relative z-20 order-1 lg:order-2 lg:pl-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none mb-8">
              {ORIGIN_STORY.TITLE}
            </h2>

            <div className="space-y-6 text-text-muted text-lg md:text-xl font-light leading-relaxed">
              <p>{ORIGIN_STORY.DESC_1}</p>
              <p className="pl-6 border-l-4 border-brand-primary text-white italic text-xl md:text-2xl py-2 my-8 font-medium">
                {ORIGIN_STORY.DESC_2}
              </p>
              <p>{ORIGIN_STORY.DESC_3}</p>
            </div>

            <div className="pt-8">
              <Link href="/architect" className="inline-flex items-center gap-3 btn-brand px-8 py-4 rounded-lg uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] transition-all group">
                {ORIGIN_STORY.CTA}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}