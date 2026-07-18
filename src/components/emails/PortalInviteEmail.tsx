// src/components/emails/PortalInviteEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/utils/glossary';

interface PortalInviteEmailProps {
  operatorName?: string;
  workspaceName?: string;
  inviteLink: string; // FIXED: Matches the backend API payload
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
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl font-bold uppercase tracking-widest m-0 mb-3">
          {copy.HEADER}
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          {copy.SUBHEADER}
        </Text>
      </Section>
      
      <Section className="mb-6">
        <Text className="text-white text-base m-0 mb-4">{copy.GREETING} {operatorName},</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.INTRO_START}<strong className="text-white">{workspaceName}</strong>{copy.INTRO_MID}<strong className="text-cyan-400">{role}</strong>{copy.INTRO_END}
        </Text>
      </Section>

      <Section className="mb-6 bg-zinc-950/50 rounded-lg border-l-4 border-l-cyan-400 p-6">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-3">
          {copy.USE_SPACE_TITLE}
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.USE_SPACE_BODY}
        </Text>
      </Section>

      <Section className="mb-8 bg-zinc-950/50 rounded-lg border-l-4 border-l-fuchsia-500 p-6">
        <Text className="text-fuchsia-500 font-bold text-xs uppercase tracking-widest m-0 mb-3">
          {copy.HEADS_UP_TITLE}
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.HEADS_UP_BODY}
        </Text>
      </Section>

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
      
      <Section>
        <Text className="text-zinc-500 text-xs m-0 mb-1">{copy.SIGN_OFF}</Text>
        <Text className="text-cyan-400 font-bold text-sm m-0">{copy.SIGNATURE}</Text>
      </Section>
    </BaseEmailLayout>
  );
}