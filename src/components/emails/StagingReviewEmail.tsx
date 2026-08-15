// src/components/emails/StagingReviewEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface StagingReviewEmailProps {
  clientName?: string; // 🚨 UPDATED: Changed from 'name' to 'clientName' for consistency
  businessName: string;
  previewUrl: string;
  storefrontId?: string; 
}

export default function StagingReviewEmail({
  clientName = 'Client',
  businessName = 'Your Storefront',
  previewUrl = 'https://alternativesolutions.io'
}: StagingReviewEmailProps) {

  const copy = EMAIL_COPY.STAGING_REVIEW;

  return (
    <BaseEmailLayout>
      {/* HEADER: Clean, approachable typography */}
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-cyan-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-cyan-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          {copy.HEADER} • {copy.SUBHEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          Your digital storefront preview is ready.
        </Heading>
        <Text className="text-zinc-400 font-mono text-sm md:text-base font-semibold m-0">
          Project: {businessName}
        </Text>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {copy.GREETING} {clientName}, {copy.BODY_1}
      </Text>

      {/* SINGLE CALL TO ACTION */}
      <Section className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-6 mb-8 text-center shadow-sm">
        <Button
          href={previewUrl}
          className="bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] no-underline inline-block"
        >
          {copy.CTA_BUTTON}
        </Button>
      </Section>

      {/* THE PROGRESS INSTRUCTIONS */}
      <Section className="bg-zinc-900/30 border-l-4 border-l-cyan-400 p-6 rounded-r-xl mb-8">
        <Text className="text-white font-bold text-sm m-0 mb-4">
          {copy.INSTRUCTIONS_TITLE}
        </Text>
        <Text className="text-zinc-300 text-xs leading-relaxed m-0 mb-5 font-light">
          {copy.INSTRUCTIONS_INTRO}
        </Text>
        
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 mb-4 font-light">
          <strong className="text-cyan-400 font-semibold">{copy.INSTRUCTION_1_TITLE}:</strong> {copy.INSTRUCTION_1_BODY}
        </Text>
        
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 mb-5 font-light">
          <strong className="text-cyan-400 font-semibold">{copy.INSTRUCTION_2_TITLE}:</strong> {copy.INSTRUCTION_2_BODY}
        </Text>
        
        <div className="bg-black/50 p-3.5 rounded-lg border border-zinc-800/80">
          <Text className="text-zinc-400 text-[10px] leading-relaxed m-0 font-mono uppercase tracking-widest">
            <strong className="text-cyan-400 font-semibold">{copy.INSTRUCTION_3_TITLE}:</strong> {copy.INSTRUCTION_3_BODY}
          </Text>
        </div>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0">{copy.NAME}</Text>
      <Text className="text-cyan-400 font-mono text-xs m-0">{copy.TITLE}</Text>

      <Hr className="border-zinc-800/80 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}