/* src/components/emails/FollowUpEmail.tsx */
import React from 'react';
import { Section, Text, Heading, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface FollowUpEmailProps {
  clientName: string;
  checkoutUrl: string;
  cancelUrl: string;
}

export default function FollowUpEmail({ clientName, checkoutUrl, cancelUrl }: FollowUpEmailProps) {
  const copy = EMAIL_COPY.FOLLOW_UP;

  return (
    <BaseEmailLayout>
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-amber-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-amber-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          {copy.HEADER} • {copy.SUBHEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0">
          Still want to build this?
        </Heading>
      </Section>

      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-4 font-light">
        {copy.GREETING} {clientName},
      </Text>
      
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-4 font-light">
        {copy.BODY_1}
      </Text>
      
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-8 font-light">
        {copy.BODY_2}
      </Text>

      <Section className="mb-10 text-center">
        <Button
          href={checkoutUrl}
          className="bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] no-underline inline-block w-full max-w-sm mb-4"
        >
          {copy.BTN_YES}
        </Button>
        
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0 mb-4">
          — OR —
        </Text>
        
        <Button
          href={cancelUrl}
          className="bg-zinc-900 border border-zinc-700 hover:bg-rose-500/10 hover:border-rose-500/50 text-zinc-400 hover:text-rose-400 font-bold text-xs uppercase tracking-widest px-8 py-3 rounded-xl transition-all no-underline inline-block w-full max-w-sm"
        >
          {copy.BTN_NO}
        </Button>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0 tracking-wide">{copy.NAME}</Text>
      <Text className="text-cyan-500 font-mono text-[11px] uppercase tracking-widest m-0 mt-1">{copy.TITLE}</Text>
    </BaseEmailLayout>
  );
}