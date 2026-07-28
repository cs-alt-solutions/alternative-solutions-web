// src/components/emails/StagingAuditReceiptEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';

export interface StagingAuditReceiptEmailProps {
  name?: string;
  businessName: string;
  clientEmail?: string;
  status: 'APPROVED' | 'CHANGES_REQUESTED';
  completedSteps: number[];
  sectionNotes: Record<number, string>;
  planTier?: string;
  recipientType?: 'client' | 'admin';
}

// Define the 4 mandatory staging review checkpoints
const AUDIT_SECTIONS = [
  { step: 0, title: "Section 1: Foundational Aesthetic & Hero Layout" },
  { step: 1, title: "Section 2: Brand Story & About Narrative" },
  { step: 2, title: "Section 3: Core Offerings & Content Flow" },
  { step: 3, title: "Section 4: Contact Routing & Functional Polish" }
];

export default function StagingAuditReceiptEmail({
  name = 'Founder',
  businessName = 'Your Empire',
  clientEmail = '',
  status = 'APPROVED',
  completedSteps = [0, 1, 2, 3],
  sectionNotes = {},
  planTier = 'Standard Starter',
  recipientType = 'client'
}: StagingAuditReceiptEmailProps) {
  const isApproved = status === 'APPROVED';
  const isAdmin = recipientType === 'admin';

  return (
    <BaseEmailLayout>
      {/* EXECUTIVE HEADER */}
      <Section className={`bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 ${isApproved ? 'border-emerald-500' : 'border-fuchsia-500'} rounded-t-xl -mt-10 -mx-10 mb-8`}>
        <Text className={`${isApproved ? 'text-emerald-400' : 'text-fuchsia-400'} font-mono text-xs uppercase tracking-widest m-0 mb-2`}>
          {isAdmin 
            ? `INTERNAL ALERT • ${isApproved ? 'STAGE APPROVED' : 'CHANGES LOGGED'}`
            : `Pre-Launch Review • ${isApproved ? 'Approved & Locked' : 'Adjustments Logged'}`}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          {isAdmin
            ? `${businessName} submitted an audit review.`
            : isApproved 
              ? "We have your official sign-off." 
              : "We have logged your adjustment requests."}
        </Heading>
        <Text className="text-cyan-400 font-mono text-sm md:text-base font-semibold m-0">
          {isAdmin && clientEmail ? `${name} (${clientEmail})` : businessName}
        </Text>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {isAdmin
          ? `Here is the official staging review contract submitted by ${name} for ${businessName}. Review their 4-section sign-off ledger below.`
          : isApproved 
            ? `Thank you for completing your live staging review, ${name}. You have verified all 4 checkpoints with zero requested changes. This build is officially locked in our dev queue for final production deployment.`
            : `Thank you for completing your live staging review, ${name}. We have logged your verified checkpoints and adjustment requests below. Our team is jumping under the hood to execute your exact tweak list.`}
      </Text>

      {/* THE 4-SECTION BOUNDARY LEDGER */}
      <Section className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-6 mb-8 shadow-sm">
        <Text className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest m-0 mb-4">
          Official 4-Section Sign-Off Ledger
        </Text>

        <div className="space-y-4">
          {AUDIT_SECTIONS.map((sec) => {
            const rawNote = sectionNotes[sec.step]?.trim();
            const hasNote = Boolean(rawNote && rawNote.length > 0);

            return (
              <div key={sec.step} className="bg-black/60 p-4 rounded-xl border border-zinc-800/80 font-mono text-xs">
                <Text className="text-white font-bold m-0 mb-1.5 uppercase tracking-wide">
                  {sec.title}
                </Text>
                {hasNote ? (
                  <div className="bg-fuchsia-950/20 border-l-2 border-fuchsia-500 pl-3 py-1 mt-2">
                    <Text className="text-fuchsia-400 font-bold m-0 text-[10px] uppercase tracking-widest mb-1">
                      [ ADJUSTMENT LOGGED ]
                    </Text>
                    <Text className="text-zinc-300 m-0 leading-relaxed font-sans italic">
                      &ldquo;{rawNote}&rdquo;
                    </Text>
                  </div>
                ) : (
                  <div className="bg-emerald-950/20 border-l-2 border-emerald-500 pl-3 py-1 mt-2">
                    <Text className="text-emerald-400 font-bold m-0 text-[10px] uppercase tracking-widest">
                      [ APPROVED AS-IS ] No changes requested. Section locked.
                    </Text>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>

      {/* WHAT HAPPENS NEXT CALLOUT */}
      <Section className={`bg-zinc-900/30 border-l-4 ${isApproved ? 'border-l-emerald-400' : 'border-l-cyan-400'} p-6 rounded-r-xl mb-8`}>
        <Text className="text-white font-bold text-sm m-0 mb-2">
          {isAdmin ? "Admin Action Required" : "What happens next?"}
        </Text>
        <Text className="text-zinc-300 text-xs leading-relaxed m-0 font-light">
          {isAdmin
            ? isApproved
              ? `Client has locked the build! Verify their ${planTier} recurring subscription plan is active and initiate domain DNS wiring protocols.`
              : `Client requested specific adjustments. Open the active codebase, apply the tweak list in a single pass, and push to staging for their second review.`
            : isApproved 
              ? `Keep an eye on your inbox for your official hosting activation link. Initializing your recurring ${planTier} plan gets your site live on the Alternative Solutions grid immediately. If you selected our Professional Tier ($15/mo), we will begin guiding you through securing your custom .com domain.`
              : `Our Review Promise: We do focused, purposeful reviews—not endless revision loops. We are taking your exact adjustment list above and applying it to the codebase in one clean pass. Once applied, we will send an updated link for your final approval.`}
        </Text>
      </Section>

      {/* SIGN-OFF (Only rendered for Client emails) */}
      {!isAdmin && (
        <>
          <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">Standing by,</Text>
          <Text className="text-white font-bold text-base m-0">Courtney Sulenski</Text>
          <Text className="text-fuchsia-400 font-mono text-xs m-0">Founder & Lead Solutions Architect • Alternative Solutions</Text>
        </>
      )}

      <Hr className="border-zinc-800/80 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}