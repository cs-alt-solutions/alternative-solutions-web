// src/components/emails/StagingAuditReceiptEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';

export interface StagingAuditReceiptEmailProps {
  name?: string;
  businessName: string;
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  completedSteps: number[];
  sectionNotes: Record<number, string>;
  planTier?: string;
}

export default function StagingAuditReceiptEmail({
  name = 'Founder',
  businessName = 'Your Empire',
  status = 'APPROVED',
  completedSteps = [0, 1, 2, 3],
  sectionNotes = {},
  planTier = 'Standard Starter'
}: StagingAuditReceiptEmailProps) {
  const isApproved = status === 'APPROVED';

  // Format logged notes into a clean, readable list
  const formattedNotes = Object.entries(sectionNotes)
    .filter(([_, note]) => Boolean(note && note.trim()))
    .map(([step, note]) => `• Section ${Number(step) + 1}: "${note}"`)
    .join('\n') || (isApproved ? 'No specific adjustments requested. Build approved as-is!' : 'No written notes provided.');

  return (
    <BaseEmailLayout>
      {/* HEADER */}
      <Section className={`bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 ${isApproved ? 'border-emerald-500' : 'border-fuchsia-500'} rounded-t-xl -mt-10 -mx-10 mb-8`}>
        <Text className={`${isApproved ? 'text-emerald-400' : 'text-fuchsia-400'} font-mono text-xs uppercase tracking-widest m-0 mb-2`}>
          {isApproved ? 'Pre-Launch Review • Approved & Locked' : 'Pre-Launch Review • Adjustments Logged'}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          {isApproved ? "We have your official sign-off!" : "You just helped make this build 10x better!"}
        </Heading>
        <Text className="text-cyan-400 font-mono text-sm md:text-base font-semibold m-0">
          {businessName}
        </Text>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {isApproved 
          ? `Thank you for taking the time to walk through your live preview, ${name}! We have logged your verified checkpoints and locked in this build for production deployment. You did awesome!`
          : `Thank you for taking the time to walk through your live preview, ${name}! We have logged your notes and checkpoints, and I am diving under the hood to execute your adjustments.`}
      </Text>

      {/* WHAT HAPPENS NEXT CALLOUT */}
      <Section className={`bg-zinc-900/30 border-l-4 ${isApproved ? 'border-l-emerald-400' : 'border-l-cyan-400'} p-6 rounded-r-xl mb-8`}>
        <Text className="text-white font-bold text-sm m-0 mb-2">
          What happens next?
        </Text>
        <Text className="text-zinc-300 text-xs leading-relaxed m-0 font-light">
          {isApproved 
            ? `Keep an eye on your inbox for your official hosting activation link! Initializing your recurring ${planTier} plan gets your site live on the Alternative Solutions grid immediately. If you selected our Professional Tier ($15/mo), I will also begin guiding you through securing your custom .com domain so we can handle the DNS wiring!`
            : `⚡ Our Review Promise: We do focused, purposeful reviews—not endless revision loops! I am taking your exact tweak list below and applying it to the codebase in one clean, lightning-fast pass. Once everything looks pristine, I will send an updated link back your way for final sign-off!`}
        </Text>
      </Section>

      {/* VERIFIED CHECKPOINTS & LOGGED NOTES */}
      <Section className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 mb-8 shadow-sm">
        <Text className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest m-0 mb-3">
          Your Logged Review Receipt ({completedSteps.length}/4 Sections Checked)
        </Text>
        <div className="bg-black/50 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
          {formattedNotes}
        </div>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">Standing by,</Text>
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