/* src/components/HowWeWork.tsx */
import { WEBSITE_COPY } from '@/utils/glossary';

export default function HowWeWork() {
  const steps = [
    { ...WEBSITE_COPY.HOW_IT_WORKS.STEP_1, icon: "01" },
    { ...WEBSITE_COPY.HOW_IT_WORKS.STEP_2, icon: "02" },
    { ...WEBSITE_COPY.HOW_IT_WORKS.STEP_3, icon: "03" },
  ];

  return (
    <section className="py-32 px-6 bg-bg-app relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em] mb-4">{WEBSITE_COPY.HOW_IT_WORKS.SUBTITLE}</h2>
          <h3 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase">{WEBSITE_COPY.HOW_IT_WORKS.TITLE}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step) => (
            <div key={step.icon} className="relative group">
              <div className="text-8xl font-black text-white/5 absolute -top-12 -left-4 transition-colors group-hover:text-brand-primary/10">{step.icon}</div>
              <div className="relative z-10">
                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-brand-accent inline-block" />
                  {step.TITLE}
                </h4>
                <p className="text-text-muted leading-relaxed font-light">{step.DESC}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}