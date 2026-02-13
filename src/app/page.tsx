import { WEBSITE_COPY } from '@/utils/glossary';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-6 text-center bg-bg-app">
      <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-white">
        SMARTER <br />
        <span className="text-gradient-cyan">BUSINESS SYSTEMS.</span>
      </h1>
      <p className="text-xl text-text-muted max-w-2xl mb-12 font-light">
        {WEBSITE_COPY.HERO.SUBHEAD}
      </p>
      <button className="btn-brand">
        {WEBSITE_COPY.HERO.CTA_PRIMARY}
      </button>
    </main>
  );
}