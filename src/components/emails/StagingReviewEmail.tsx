// src/components/emails/StagingReviewEmail.tsx
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
      {/* HEADER: Clean, approachable typography without the aggressive all-caps */}
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-fuchsia-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-fuchsia-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          Pre-Launch Deployment • Ready For Review
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          Your website is built and ready for review.
        </Heading>
        <Text className="text-cyan-400 font-mono text-sm md:text-base font-semibold m-0">
          {businessName}
        </Text>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        We did it! I have everything built, wired up, and deployed to a private live link just for you. Before we lock in your <strong className="text-white font-medium">{planTier}</strong> hosting and push this out to the world, I need you to jump in and go through it one more time.
      </Text>

      {/* ACTION CALLOUT */}
      <Section className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 mb-8 text-center shadow-sm">
        <Text className="text-white font-bold text-base m-0 mb-2">
          Take It For A Spin
        </Text>
        <Text className="text-zinc-400 text-sm m-0 mb-6 font-light max-w-md mx-auto">
          Click below to test your layout on desktop and mobile. Check your text, click the links, and make sure the overall vibe hits exactly how you envisioned.
        </Text>
        <Button
          href={previewUrl}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(192,38,213,0.3)] no-underline inline-block"
        >
          Review Your Live Site
        </Button>
      </Section>

      {/* THE REVIEW GUIDE: Structured, scannable, and polite */}
      <Section className="bg-zinc-900/30 border-l-4 border-l-cyan-400 p-6 rounded-r-xl mb-8">
        <Text className="text-white font-bold text-sm m-0 mb-2">
          How Our Review Stage Works
        </Text>
        <Text className="text-zinc-300 text-xs leading-relaxed m-0 mb-4 font-light">
          I built an interactive walkthrough box right into the bottom corner of your screen to make this super easy:
        </Text>
        
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 mb-3 font-light">
          <strong className="text-emerald-400 font-semibold">✔ If you love it:</strong> Check off the verification boxes in the widget and hit <strong className="text-zinc-200 font-medium">Approve!</strong> That locks in your build, and I will send over the link to initialize your recurring hosting plan so we can flip your domain live!
        </Text>
        
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 mb-4 font-light">
          <strong className="text-rose-400 font-semibold">✔ If you want tweaks:</strong> This is your chance! If a headline needs tweaking or a section doesn't hit right, type your notes directly into the walkthrough box and hit submit.
        </Text>
        
        <div className="bg-black/50 p-3.5 rounded-lg border border-zinc-800/80">
          <Text className="text-cyan-400 text-[11px] leading-relaxed m-0 font-mono">
            <strong>⚡ Note on Revisions:</strong> We do focused, purposeful reviews—not endless revision loops! Please list all of your adjustments right now in this review so I can execute them in one clean, lightning-fast pass.
          </Text>
        </div>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">Standing by for your green light,</Text>
      <Text className="text-white font-bold text-base m-0">Courtney Sulenski</Text>
      <Text className="text-fuchsia-400 font-mono text-xs m-0">Founder & Lead Solutions Architect • Alternative Solutions</Text>

      <Hr className="border-zinc-800/80 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}