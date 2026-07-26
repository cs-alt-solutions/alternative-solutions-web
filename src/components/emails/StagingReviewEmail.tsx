import React from 'react';
import { Section, Text, Heading, Hr, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';

export interface StagingReviewEmailProps {
  name: string;
  businessName: string;
  previewUrl: string;
  planTier?: string;
}

export default function StagingReviewEmail({
  name = 'Founder',
  businessName = 'Your Empire',
  previewUrl = 'https://alternativesolutions.io',
  planTier = 'Standard Starter'
}: StagingReviewEmailProps) {
  return (
    <BaseEmailLayout>
      {/* HEADER */}
      <Section className="bg-zinc-900/80 text-left p-6 md:p-8 border-b-2 border-fuchsia-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-fuchsia-400 font-mono text-xs uppercase tracking-widest m-0 mb-1">
          Staging Deployment • Ready For Review
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase m-0">
          Your staging engine is live, {name}.
        </Heading>
      </Section>

      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        I have finished engineering the custom architecture and layout for <strong className="text-white font-bold">{businessName}</strong>. Your digital canvas is now deployed to my private staging server for your review.
      </Text>

      {/* ACTION CALLOUT */}
      <Section className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 mb-8 text-center shadow-sm">
        <Text className="text-white font-bold text-base uppercase tracking-wider m-0 mb-2">
          Test Your Interactive Blueprint
        </Text>
        <Text className="text-zinc-400 text-sm m-0 mb-6 font-light">
          Click below to explore your layout on both desktop and mobile. Check your hero text, review your story section, and make sure the vibe hits exactly how you envisioned.
        </Text>
        <Button
          href={previewUrl}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(192,38,213,0.3)] no-underline inline-block"
        >
          Explore Staging Engine
        </Button>
      </Section>

      {/* THE NEXT STEP & RATE LOCK */}
      <Section className="bg-zinc-900/40 border-l-4 border-l-cyan-400 p-6 rounded-r-xl mb-8">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-2">
          How To Approve Or Request Changes
        </Text>
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 font-light">
          If you love what I built and are ready to go live, <strong className="text-zinc-200 font-medium">simply hit reply and say "Approved!"</strong> Once approved, I will lock in your forever rate for your <strong className="text-white font-bold">{planTier}</strong> plan, initialize your recurring subscription, and flip your domain to live production. If you want any adjustments before billing begins, reply with your tweak list and I will execute them immediately.
        </Text>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">Standing by for your green light,</Text>
      <Text className="text-white font-black text-base uppercase tracking-wide m-0">Courtney Sulenski</Text>
      <Text className="text-fuchsia-400 font-mono text-xs m-0">Founder & Lead Solutions Architect • Alternative Solutions</Text>

      <Hr className="border-zinc-800 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}