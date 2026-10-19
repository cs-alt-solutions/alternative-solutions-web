/* src/components/emails/AssetReminderEmail.tsx */
import React from 'react';
import { Section, Text, Heading, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface AssetReminderEmailProps {
  clientName: string;
  vaultUrl: string;
}

export default function AssetReminderEmail({ clientName, vaultUrl }: AssetReminderEmailProps) {
  const copy = EMAIL_COPY.ASSET_REMINDER;

  return (
    <BaseEmailLayout>
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-violet-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-violet-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          {copy.HEADER} • {copy.SUBHEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0">
          Waiting on your assets.
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
          href={vaultUrl}
          className="bg-violet-600 hover:bg-violet-500 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] no-underline inline-block w-full max-w-sm"
        >
          {copy.CTA_BUTTON}
        </Button>
      </Section>

      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0 tracking-wide">{copy.NAME}</Text>
      <Text className="text-cyan-500 font-mono text-[11px] uppercase tracking-widest m-0 mt-1">{copy.TITLE}</Text>
    </BaseEmailLayout>
  );
}