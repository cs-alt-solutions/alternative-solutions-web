import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

// 🚀 BULLETPROOF INTERFACE: Made secondary fields optional so builds never fail
export interface AdminIntakeEmailProps {
  name: string;
  email: string;
  phone?: string;
  socials?: string;
  existingWebsite?: string;
  projectScope?: string;
  businessName?: string;
  selectedPlan?: string;
  selectedVibe?: string;
  wantsCustom?: boolean;
  isPriority?: boolean;
}

export default function AdminIntakeEmail({
  name,
  email,
  phone,
  socials = 'None provided',
  existingWebsite = 'None provided',
  projectScope = 'No scope provided',
  businessName,
  selectedPlan = 'Standard Tier',
  selectedVibe = 'Midnight Standard',
  wantsCustom = false,
  isPriority = false
}: AdminIntakeEmailProps) {
  const copy = EMAIL_COPY.ADMIN_INTAKE;

  // Safe display resolvers to prevent any .toUpperCase() runtime exceptions
  const displayBusiness = businessName || name || 'Unnamed Project';
  const displayPlan = (selectedPlan || 'Standard Tier').toUpperCase();
  const displayVibe = (selectedVibe || 'Midnight Standard').toUpperCase();

  return (
    <BaseEmailLayout>
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
          🚨 NEW STOREFRONT APPLICATION
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          Target: {displayBusiness}
        </Text>
      </Section>
      
      <Section className="mb-4">
        <Text className="text-white text-base m-0 mb-4">A new application has been submitted.</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0">
          Review the initial parameters below before logging into the Command Center to begin the build process.
        </Text>
      </Section>

      {isPriority && (
        <Section className="mb-6 bg-amber-500/10 rounded-lg border-l-4 border-l-amber-500 p-4 text-center">
             <Text className="text-amber-500 font-black text-xs uppercase tracking-widest m-0">
               ⚠️ Priority Queue Requested
             </Text>
        </Section>
      )}

      <Section className="mb-6 bg-zinc-950/50 rounded-lg border-l-4 border-l-cyan-400 p-6">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-4">
          Identity & Footprint
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Business Name:</strong> {displayBusiness}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Point of Contact:</strong> {name}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Email:</strong> {email}</Text>
        {phone && <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Phone:</strong> {phone}</Text>}
        <Text className="text-zinc-300 text-sm m-0 mb-2 mt-4"><strong className="text-white">Socials:</strong> {socials}</Text>
        <Text className="text-zinc-300 text-sm m-0"><strong className="text-white">Existing URL:</strong> {existingWebsite}</Text>
      </Section>

      <Section className="mb-8 bg-zinc-950/50 rounded-lg border-l-4 border-l-emerald-400 p-6">
        <Text className="text-emerald-400 font-bold text-xs uppercase tracking-widest m-0 mb-4">
          Project Architecture
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Plan Tier:</strong> {displayPlan}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2"><strong className="text-white">Base Vibe:</strong> {displayVibe}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-4"><strong className="text-white">Wants Custom Code?:</strong> {wantsCustom ? 'YES' : 'NO'}</Text>
        
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-2 mt-4">
          Project Scope:
        </Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0 italic bg-black/50 p-4 rounded border border-zinc-800">
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