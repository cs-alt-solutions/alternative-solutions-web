import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface AdminIntakeEmailProps {
  name: string;
  email: string;
  phone?: string;
  socials?: string;
  existingWebsite?: string;
  businessName?: string;
  selectedPlan?: string;
  isPriority?: boolean;
}

export default function AdminIntakeEmail({
  name,
  email,
  phone,
  socials = 'None provided',
  existingWebsite = 'None provided',
  businessName,
  selectedPlan = 'Standard',
  isPriority = false,
}: AdminIntakeEmailProps) {
  const copy = EMAIL_COPY?.ADMIN_INTAKE || {};

  const displayBusiness = businessName || name || 'Unnamed Project';
  const displayPlan = String(selectedPlan || 'Standard').toUpperCase();

  return (
    <BaseEmailLayout>
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
          🚨 NEW STOREFRONT INTAKE
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          Target • {displayBusiness}
        </Text>
      </Section>
      
      <Section className="mb-4">
        <Text className="text-white text-base font-bold m-0 mb-2">A new prospect has submitted their basic details.</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0 font-light">
          Review their identity and footprint below before logging into the Command Center to initiate the discovery phase.
        </Text>
      </Section>

      {isPriority && (
        <Section className="mb-6 bg-amber-500/10 rounded-lg border-l-4 border-l-amber-500 p-4 text-center">
          <Text className="text-amber-400 font-black text-xs uppercase tracking-widest m-0">
            ⚠️ Priority Queue Fast-Track Requested ($1 Upgrade)
          </Text>
        </Section>
      )}

      {/* 1. IDENTITY & ROUTING */}
      <Section className="mb-6 bg-zinc-950/60 rounded-xl border-l-4 border-l-cyan-400 p-6 shadow-sm">
        <Text className="text-cyan-400 font-mono font-bold text-xs uppercase tracking-widest m-0 mb-4">
          Identity & Routing
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Business Name:</strong> {displayBusiness}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Point of Contact:</strong> {name}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Email Routing:</strong> {email}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Phone Number:</strong> {phone || 'Not provided'}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Requested Tier:</strong> {displayPlan}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Existing Domain:</strong> {existingWebsite}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 mt-4 font-light"><strong className="text-white font-bold">Digital Footprint & Socials:</strong> {socials}</Text>
      </Section>
      
      <Hr className="border-zinc-800 m-0 mb-6" />
      
      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Command Telemetry • Verified
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}