import { WEBSITE_COPY } from '@/utils/glossary';

export default function Mission() {
  return (
    <section className="py-24 px-6 relative z-10 border-y border-border-subtle bg-white/2">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-6 text-white tracking-tight uppercase">{WEBSITE_COPY.MISSION.TITLE}</h2>
        <p className="text-xl text-text-muted leading-relaxed font-light italic">&ldquo;{WEBSITE_COPY.MISSION.DESC}&rdquo;</p>
      </div>
    </section>
  );
}