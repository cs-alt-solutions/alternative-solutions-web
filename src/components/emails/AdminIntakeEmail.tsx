import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface AdminIntakeEmailProps {
  name: string;
  email: string;
  socials?: string;
  businessName?: string;
}

export default function AdminIntakeEmail({
  name,
  email,
  socials = 'None provided',
  businessName,
}: AdminIntakeEmailProps) {
  const copy = EMAIL_COPY?.ADMIN_INTAKE || {};

  const displayBusiness = businessName || name || 'Unnamed Project';

  return (
    <BaseEmailLayout>
      <Section className="bg-slate-900 text-left pt-10 pb-8 px-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest m-0 mb-2">
          🚨 {copy.HEADER_TITLE}
        </Heading>
        <Text className="text-cyan-400 font-mono text-xs uppercase tracking-widest m-0">
          Project: {displayBusiness}
        </Text>
      </Section>
      
      <Section className="mb-4">
        <Text className="text-white text-base font-bold m-0 mb-2">
          {copy.GREETING}
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0 font-light">
          {copy.BODY}
        </Text>
      </Section>

      {/* THE DETAILS */}
      <Section className="mb-6 mt-8 bg-zinc-950/60 rounded-xl border-l-4 border-l-cyan-400 p-6 shadow-sm">
        <Text className="text-cyan-400 font-bold text-xs uppercase tracking-widest m-0 mb-4">
          {copy.SECTIONS?.IDENTITY}
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light">
          <strong className="text-white font-bold">{copy.LABELS?.BUSINESS_NAME}</strong> {displayBusiness}
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light">
          <strong className="text-white font-bold">{copy.LABELS?.CONTACT}</strong> {name}
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light">
          <strong className="text-white font-bold">{copy.LABELS?.EMAIL}</strong> {email}
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mt-4 font-light">
          <strong className="text-white font-bold">{copy.LABELS?.SOCIALS}</strong> {socials}
        </Text>
      </Section>
      
      <Hr className="border-zinc-800 m-0 mb-6" />
      
      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Internal Update
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}