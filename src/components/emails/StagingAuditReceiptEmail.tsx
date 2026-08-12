// src/components/emails/StagingAuditReceiptEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

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
  name = 'Client',
  businessName = 'Your Storefront',
  clientEmail = '',
  status = 'APPROVED',
  completedSteps = [0, 1, 2, 3],
  sectionNotes = {},
  planTier = 'Foundation Plan',
  recipientType = 'client'
}: StagingAuditReceiptEmailProps) {
  const isApproved = status === 'APPROVED';
  const isAdmin = recipientType === 'admin';
  const copy = EMAIL_COPY.STAGING_RECEIPT;

  return (
    <BaseEmailLayout>
      <Section className="mt-8">
        
        {/* EXECUTIVE HEADER */}
        <Heading className={`text-2xl md:text-3xl font-black uppercase tracking-widest m-0 mb-4 ${isApproved ? 'text-emerald-400' : 'text-amber-400'}`}>
          {isAdmin 
            ? `[ALERT] ${isApproved ? 'STAGE APPROVED' : 'CHANGES LOGGED'}`
            : `Review: ${isApproved ? 'Approved & Locked' : 'Adjustments Logged'}`}
        </Heading>

        <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-8 font-light">
          <strong className="text-white">Project: {isAdmin && clientEmail ? `${businessName} (${clientEmail})` : businessName}</strong>
          <br /><br />
          {isAdmin
            ? `The official staging review contract has been submitted by ${name}. Review the 4-section sign-off ledger below.`
            : isApproved 
              ? `Thank you for completing your live staging review, ${name}. You have verified all 4 checkpoints with zero requested changes. This build is officially locked in our dev queue for final deployment.`
              : `Thank you for completing your live staging review, ${name}. We have logged your verified checkpoints and adjustment requests below. Our team is jumping under the hood to execute your exact tweak list.`}
        </Text>

        {/* THE 4-SECTION BOUNDARY LEDGER */}
        <Section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8 shadow-sm">
          <Heading className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest m-0 mb-6">
            Official Sign-Off Ledger
          </Heading>

          {AUDIT_SECTIONS.map((sec, index) => {
            const rawNote = sectionNotes[sec.step]?.trim();
            const hasNote = Boolean(rawNote && rawNote.length > 0);
            const isLast = index === AUDIT_SECTIONS.length - 1;

            return (
              <Section key={sec.step} className={`bg-black p-4 rounded-lg border border-zinc-800 ${isLast ? '' : 'mb-4'}`}>
                <Text className="text-zinc-100 font-bold m-0 mb-2 text-[13px] uppercase tracking-wide">
                  {sec.title}
                </Text>
                
                {hasNote ? (
                  <Section className="border-l-2 border-amber-500 pl-4 mt-2">
                    <Text className="text-amber-400 font-bold m-0 text-[10px] uppercase tracking-widest mb-1">
                      [ Adjustment Logged ]
                    </Text>
                    <Text className="text-zinc-300 m-0 text-sm leading-relaxed italic">
                      &ldquo;{rawNote}&rdquo;
                    </Text>
                  </Section>
                ) : (
                  <Section className="border-l-2 border-emerald-500 pl-4 mt-2">
                    <Text className="text-emerald-400 font-bold m-0 text-[10px] uppercase tracking-widest">
                      [ Approved As-Is ] No changes requested. Section locked.
                    </Text>
                  </Section>
                )}
              </Section>
            );
          })}
        </Section>

        {/* WHAT HAPPENS NEXT CALLOUT */}
        <Section className={`bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8 border-l-4 ${isApproved ? 'border-l-emerald-500' : 'border-l-cyan-500'}`}>
          <Heading className="text-xs font-black text-white uppercase tracking-widest mb-3 m-0">
            {isAdmin ? "Admin Action Required" : "Next Protocol"}
          </Heading>
          <Text className="text-zinc-400 text-sm m-0 leading-relaxed">
            {isAdmin
              ? isApproved
                ? copy.ADMIN_APPROVED
                : copy.ADMIN_CHANGES
              : isApproved 
                ? copy.CLIENT_APPROVED
                : copy.CLIENT_CHANGES}
          </Text>
        </Section>

        {/* SIGN-OFF (Only rendered for Client emails) */}
        {!isAdmin && (
          <Section>
            <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
            <Text className="text-white font-bold text-base m-0 tracking-wide">{copy.NAME}</Text>
            <Text className="text-cyan-500 font-mono text-[11px] uppercase tracking-widest m-0 mt-1">{copy.TITLE}</Text>
          </Section>
        )}

      </Section>
    </BaseEmailLayout>
  );
}