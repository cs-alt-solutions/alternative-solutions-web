// src/emails/AdminIntakeEmail.tsx
import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/utils/glossary';

interface AdminIntakeEmailProps {
  name: string;
  email: string;
  phone?: string;
  socials: string;
  existingWebsite?: string;
  projectScope: string;
}

export default function AdminIntakeEmail({
  name,
  email,
  phone,
  socials,
  existingWebsite,
  projectScope,
}: AdminIntakeEmailProps) {
  const copy = EMAIL_COPY.ADMIN_INTAKE;

  return (
    <BaseEmailLayout>
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
          {copy.HEADER}
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          {copy.SUBHEADER}
        </Text>
      </Section>
      
      <Section className="mb-4">
        <Text className="text-white text-base m-0 mb-4">{copy.GREETING}</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          {copy.INTRO}
        </Text>
      </Section>

      <Section className="mb-6 bg-zinc-950/50 rounded-lg border-l-4 border-l-cyan-400 p-6">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-4">
          Identity & Footprint:
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Name:</strong> {name}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Email:</strong> {email}</Text>
        {phone && <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Phone:</strong> {phone}</Text>}
        <Text className="text-zinc-300 text-sm m-0 mb-2 mt-4"><strong className="text-white">Socials:</strong> {socials || 'None provided'}</Text>
        <Text className="text-zinc-300 text-sm m-0"><strong className="text-white">Existing URL:</strong> {existingWebsite || 'None provided'}</Text>
      </Section>

      <Section className="mb-8 bg-zinc-950/50 rounded-lg border-l-4 border-l-fuchsia-500 p-6">
        <Text className="text-fuchsia-500 font-bold text-xs uppercase tracking-widest m-0 mb-4">
          Project Scope:
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0 italic">
          "{projectScope}"
        </Text>
      </Section>
      
      <Hr className="border-zinc-700 m-0 mb-6" />
      
      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          System Telemetry // Secure
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}