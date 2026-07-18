import React from 'react';
import { Section, Text, Heading, Hr, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

interface MagicLinkEmailProps {
  magicLink: string;
}

export default function MagicLinkEmail({ magicLink }: MagicLinkEmailProps) {
  const copy = EMAIL_COPY.MAGIC_LINK;

  return (
    <BaseEmailLayout>
      {/* The Universal Header block matching your other templates */}
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
          {copy.HEADER}
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          {copy.SUBHEADER}
        </Text>
      </Section>
      
      <Section className="mb-6">
        <Text className="text-white text-base m-0 mb-4">{copy.GREETING}</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.INTRO}
        </Text>
      </Section>

      <Section className="mb-8 bg-zinc-950/50 rounded-lg border-l-4 border-l-cyan-400 p-6">
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.BODY}
        </Text>
      </Section>

      <Section className="text-center mt-8 mb-8">
        <Button 
          href={magicLink}
          className="bg-cyan-400 text-black font-black px-10 py-4 rounded-lg text-xs uppercase tracking-widest no-underline inline-block"
        >
          {copy.CTA_BUTTON}
        </Button>
        <Text className="text-zinc-500 text-[10px] mt-6 m-0">
          If you didn't request this link, you can safely ignore it. Your command center remains secure.
        </Text>
      </Section>

      <Hr className="border-zinc-700 m-0 mb-6" />
      
      <Section>
        <Text className="text-zinc-500 text-xs m-0 mb-1">{copy.SIGN_OFF}</Text>
        <Text className="text-cyan-400 font-bold text-sm m-0">{copy.SIGNATURE}</Text>
      </Section>
    </BaseEmailLayout>
  );
}