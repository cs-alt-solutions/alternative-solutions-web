// src/components/emails/PortalInviteEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

interface PortalInviteEmailProps {
  operatorName?: string;
  workspaceName?: string;
  inviteLink: string;
  role?: string;
}

export default function PortalInviteEmail({
  operatorName = "Operator",
  workspaceName = "Your Workspace",
  inviteLink = "https://alternativesolutions.io/login",
  role = "Client Owner"
}: PortalInviteEmailProps) {
  const copy = EMAIL_COPY.PORTAL_INVITE;

  return (
    <BaseEmailLayout>
      {/* HEADER */}
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl font-bold uppercase tracking-widest m-0 mb-3">
          {copy.HEADER}
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          {copy.SUBHEADER}
        </Text>
      </Section>
      
      {/* GREETING & INTRO */}
      <Section className="mb-6">
        <Text className="text-white text-base m-0 mb-4">{copy.GREETING} {operatorName},</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.INTRO_START}<strong className="text-white">{workspaceName}</strong>{copy.INTRO_MID}<strong className="text-cyan-400">{role}</strong>{copy.INTRO_END}
        </Text>
      </Section>

      {/* HOW TO USE SPACE */}
      <Section className="mb-6 bg-zinc-950/50 rounded-lg border-l-4 border-l-cyan-400 p-6">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-3">
          {copy.USE_SPACE_TITLE}
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.USE_SPACE_BODY}
        </Text>
      </Section>

      {/* HEADS UP */}
      <Section className="mb-8 bg-zinc-950/50 rounded-lg border-l-4 border-l-fuchsia-500 p-6">
        <Text className="text-fuchsia-500 font-bold text-xs uppercase tracking-widest m-0 mb-3">
          {copy.HEADS_UP_TITLE}
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.HEADS_UP_BODY}
        </Text>
      </Section>

      {/* CTA */}
      <Section className="text-center mt-8 mb-8">
        <Text className="text-white text-sm font-bold m-0 mb-6">
          {copy.CTA_TEXT}
        </Text>
        <Button 
          href={inviteLink}
          className="bg-cyan-400 text-black font-black px-10 py-4 rounded-lg text-xs uppercase tracking-widest no-underline inline-block"
        >
          {copy.CTA_BUTTON}
        </Button>
      </Section>

      <Hr className="border-zinc-700 m-0 mb-6" />
      
      {/* STANDARD SIGNATURE */}
      <Section>
        <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
        <Text className="text-white font-bold text-base m-0 tracking-wide">{copy.NAME}</Text>
        <Text className="text-cyan-500 font-mono text-[11px] uppercase tracking-widest m-0 mt-1">{copy.TITLE}</Text>
      </Section>
    </BaseEmailLayout>
  );
}