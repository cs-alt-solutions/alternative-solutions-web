/* src/components/home/ProblemStatement.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function ProblemStatement() {
  const { PROBLEM_STATEMENT } =  WEBSITE_COPY.PUBLIC_SITE.HOME;

  return (
    <section className="mb-24 px-6 animate-in fade-in duration-1000 delay-200 text-left">
      <div className="inline-block px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs font-mono text-orange-400 uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(249,115,22,0.15)]">
        {PROBLEM_STATEMENT.TAG}
      </div>
      <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6 max-w-4xl">
        {PROBLEM_STATEMENT.TITLE}
      </h2>
      <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-3xl">
        {PROBLEM_STATEMENT.DESC}
      </p>
    </section>
  );
}