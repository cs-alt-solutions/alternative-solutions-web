/* src/components/emails/StorefrontConfirmationEmail.tsx */
import React from 'react';
import { Section, Text, Heading, Button, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export default function StorefrontConfirmationEmail({
  name = "there",
  projectName = "Your Storefront"
}: {
  name?: string;
  projectName?: string;
}) {
  const copy = EMAIL_COPY.STOREFRONT_CONFIRMATION;

  return (
    <BaseEmailLayout>
      {/* HEADER */}
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-cyan-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-cyan-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          {copy.HEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          {copy.TITLE_START}{name}.
        </Heading>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {copy.BODY_START}<strong className="text-white font-bold">{projectName}</strong>{copy.BODY_END}
      </Text>

      {/* HOW I OPERATE / RULES OF ENGAGEMENT */}
      <Section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8 border-l-4 border-l-cyan-500 shadow-sm">
        <Heading className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3 m-0">
          {copy.PLEDGE_TITLE}
        </Heading>
        <Text className="text-zinc-400 text-sm m-0 leading-relaxed font-light">
          {copy.PLEDGE_BODY}
        </Text>
      </Section>

      {/* THE NEXT STEPS SECTION (Fixed from PREP to NEXT) */}
      <Text className="text-white font-bold text-sm uppercase tracking-wider m-0 mb-2">
        {copy.NEXT_TITLE}
      </Text>
      <Text className="text-zinc-300 text-sm leading-relaxed m-0 mb-8 font-light">
        {copy.NEXT_BODY}
      </Text>

      <Hr className="border-zinc-800/80 my-8" />

      {/* SIGNATURE */}
      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0">{copy.NAME}</Text>
      <Text className="text-cyan-400 font-mono text-xs m-0">{copy.TITLE}</Text>

    </BaseEmailLayout>
  );
}