/* src/app/architect/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function ArchitectPage() {
  const { TITLE, SUBTITLE, BIO, SKILLSET, HISTORY } = WEBSITE_COPY.BEHIND_THE_ARCHITECT;

  return (
    <main className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="mb-20 border-l-4 border-cyan-500 pl-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-white uppercase">
            {TITLE}
          </h1>
          <p className="text-cyan-400 font-mono text-lg tracking-widest uppercase">
            {SUBTITLE}
          </p>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
          <div className="md:col-span-8 space-y-12 text-zinc-400 leading-relaxed text-lg font-light">
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight italic">
                {BIO.JOURNEY_TITLE}
              </h2>
              <p className="mb-6">{BIO.JOURNEY_DESC}</p>
              <p>
                Specialists are important, but in the gap between the teacher and the doer, you need a synthesis of both. I’ve done it all, so I can build it all.
              </p>
            </section>

            {/* MANIFESTO SECTION */}
            <section className="bg-zinc-900/40 p-10 rounded-lg border border-white/5 shadow-2xl">
              <h2 className="text-2xl font-bold text-cyan-500 mb-6 uppercase tracking-tight">
                {BIO.PHILOSOPHY_TITLE}
              </h2>
              <p className="italic text-zinc-300">
                "{BIO.PHILOSOPHY_DESC}"
              </p>
            </section>

            {/* INDUSTRIAL HISTORY LIST */}
            <section>
              <h3 className="text-xs font-mono text-zinc-500 mb-8 uppercase tracking-[0.4em]">
                Synthesis History // Fields of Study
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {HISTORY.map((item, idx) => (
                  <div key={idx} className="border border-white/5 p-4 rounded bg-zinc-950/50 hover:border-cyan-500/30 transition-colors">
                    <span className="block text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-1">{item.company}</span>
                    <span className="block text-sm text-zinc-200 font-bold uppercase">{item.role}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* SIDEBAR SKILLS */}
          <aside className="md:col-span-4">
            <div className="sticky top-32 border border-white/5 p-6 rounded-sm bg-zinc-950 shadow-xl">
              <h3 className="text-[10px] font-mono text-zinc-500 mb-6 uppercase tracking-[0.3em]">
                Architecture Profile
              </h3>
              <ul className="space-y-4">
                {SKILLSET.map((skill, index) => (
                  <li key={index} className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                    <div className="w-1.5 h-1.5 bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                    {skill}
                  </li>
                ))}
              </ul>
              <div className="mt-12 pt-12 border-t border-white/5 text-[10px] text-zinc-600 font-mono uppercase tracking-widest leading-loose">
                Dual Mindset // Gemini // Twin <br />
                Foundational Systems Specialist
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}