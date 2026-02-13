/* src/app/page.tsx */
import { WEBSITE_COPY } from '@/utils/glossary';
import { IndustrialButton } from '@/components/ui/IndustrialButton';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/ui/FeatureCard';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative">
      {/* Background Grid - Managed by Global CSS */}
      <div className="scanline-overlay" />

      {/* --- HERO SECTION --- */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-4">
        
        <SectionHeader 
          align="center"
          label={WEBSITE_COPY.HERO.TAGLINE}
          title={`${WEBSITE_COPY.HERO.HEADLINE_PREFIX} ${WEBSITE_COPY.HERO.HEADLINE_HIGHLIGHT}`}
          subtitle={WEBSITE_COPY.HERO.SUBHEAD}
        />

        <div className="flex flex-col md:flex-row gap-6 mt-8">
          <IndustrialButton href="/shift-studio" variant="primary">
            {WEBSITE_COPY.HERO.CTA_PRIMARY}
          </IndustrialButton>
          <IndustrialButton href="/consulting" variant="ghost">
            {WEBSITE_COPY.HERO.CTA_SECONDARY}
          </IndustrialButton>
        </div>

      </section>

      {/* --- SPLIT PATHWAYS --- */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        
        <FeatureCard 
          title="Shift Studio"
          description={WEBSITE_COPY.SHIFT_STUDIO.DESC}
          linkText="View Product"
          href="/shift-studio"
          color="cyan"
        />

        <FeatureCard 
          title="Custom Ops"
          description="Bespoke AI and software solutions tailored to your specific workflow bottlenecks."
          linkText="Work With Us"
          href="/consulting"
          color="purple"
        />

      </section>
    </main>
  );
}