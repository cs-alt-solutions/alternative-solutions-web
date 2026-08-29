// src/components/emails/SubscriptionActivationEmail.tsx
import React from 'react';
import { Section, Text, Heading, Button, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export default function SubscriptionActivationEmail({
  clientName = "there",
  projectName = "Your Storefront",
  checkoutUrl,
  planName = "Foundation Plan",
  price = "$5.00/mo"
}: {
  clientName?: string;
  projectName?: string;
  checkoutUrl: string;
  planName?: string;
  price?: string;
}) {
  const copy = EMAIL_COPY.SUBSCRIPTION_ACTIVATION;

  return (
    <BaseEmailLayout>
      {/* HEADER: Clean, approachable typography */}
      <Section className="bg-zinc-900/60 text-left p-6 md:p-8 border-b-2 border-cyan-500 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-cyan-400 font-mono text-xs uppercase tracking-widest m-0 mb-2">
          {copy.HEADER} • {copy.SUBHEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-bold tracking-tight m-0 mb-2">
          It is go time.
        </Heading>
      </Section>

      {/* CONVERSATIONAL BODY */}
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {copy.GREETING} {clientName},
        <br /><br />
        {copy.BODY_START}<strong className="text-white font-bold">{projectName}</strong>{copy.BODY_END}
      </Text>

      {/* DETAILS BOX */}
      <Section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8 border-l-4 border-l-cyan-500 shadow-sm">
        <Heading className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3 m-0">
          {copy.DETAILS_TITLE}
        </Heading>
        <Text className="text-zinc-400 text-sm m-0 mb-2 font-light">
          <strong className="text-zinc-100 font-bold">{copy.PLAN_LABEL}</strong> {planName}
        </Text>
        <Text className="text-zinc-400 text-sm m-0 font-light">
          <strong className="text-zinc-100 font-bold">{copy.PRICE_LABEL}</strong> {price}
        </Text>
      </Section>

      {/* WHAT HAPPENS NEXT */}
      <Text className="text-white font-bold text-sm uppercase tracking-wider m-0 mb-2">
        {copy.NEXT_STEPS_TITLE}
      </Text>
      <Text className="text-zinc-300 text-sm leading-relaxed m-0 mb-8 font-light">
        {copy.NEXT_STEPS_BODY}
      </Text>

      {/* CTA BUTTON */}
      <Button
        href={checkoutUrl}
        className="bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(8,145,178,0.3)] no-underline inline-block w-full text-center"
      >
        {copy.CTA_BUTTON}
      </Button>

      <Hr className="border-zinc-800/80 my-8" />

      {/* SIGNATURE */}
      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0">{copy.NAME}</Text>
      <Text className="text-cyan-400 font-mono text-xs m-0">{copy.TITLE}</Text>

      <Section className="text-center mt-8">
        <Text className="text-zinc-600 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}