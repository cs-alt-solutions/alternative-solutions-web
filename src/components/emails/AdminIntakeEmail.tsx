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
  projectScope?: string;
  businessName?: string;
  selectedPlan?: string;
  selectedVibe?: string;
  wantsCustom?: boolean;
  isPriority?: boolean;
  brandColor?: string;
  heroStructure?: string;
  storyStructure?: string;
  contentFlow?: string;
  originStory?: string;
  brainDump?: string;
  tagline?: string;
  subtext?: string;
}

export default function AdminIntakeEmail({
  name,
  email,
  phone,
  socials = 'None provided',
  existingWebsite = 'None provided',
  projectScope = 'No scope provided',
  businessName,
  selectedPlan = 'Standard Starter',
  selectedVibe = 'Midnight Onyx',
  wantsCustom = false,
  isPriority = false,
  brandColor = 'Cyan',
  heroStructure = 'Centered',
  storyStructure = 'Classic Split',
  contentFlow = 'Stacked',
  originStory,
  brainDump,
  tagline,
  subtext
}: AdminIntakeEmailProps) {
  const copy = EMAIL_COPY?.ADMIN_INTAKE || {};

  const displayBusiness = businessName || name || 'Unnamed Project';
  const displayPlan = String(selectedPlan || 'Standard Starter').toUpperCase();
  const displayVibe = String(selectedVibe || 'Midnight Onyx').toUpperCase();

  return (
    <BaseEmailLayout>
      <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-cyan-400 rounded-t-lg -mt-10 -mx-10 mb-8">
        <Heading className="text-cyan-400 text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
          🚨 NEW STOREFRONT DEPLOYMENT
        </Heading>
        <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
          Target • {displayBusiness}
        </Text>
      </Section>
      
      <Section className="mb-4">
        <Text className="text-white text-base font-bold m-0 mb-2">Incoming build specs ready for review.</Text>
        <Text className="text-zinc-300 text-sm leading-relaxed m-0 font-light">
          Review the complete engine parameters and founder vision below before logging into the Command Center to provision the canvas.
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
          1. Identity & Routing
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Business Name:</strong> {displayBusiness}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Point of Contact:</strong> {name}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Email Routing:</strong> {email}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Phone Number:</strong> {phone || 'Not provided'}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 mt-4 font-light"><strong className="text-white font-bold">Digital Footprint & Socials:</strong> {socials}</Text>
        <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Existing Domain:</strong> {existingWebsite}</Text>
      </Section>

      {/* 2. ENGINE ARCHITECTURE & SPECS */}
      <Section className="mb-6 bg-zinc-950/60 rounded-xl border-l-4 border-l-fuchsia-500 p-6 shadow-sm">
        <Text className="text-fuchsia-400 font-mono font-bold text-xs uppercase tracking-widest m-0 mb-4">
          2. Engine Architecture & Specs
        </Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Requested Tier:</strong> {displayPlan}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-2 font-light"><strong className="text-white font-bold">Foundational Vibe:</strong> {displayVibe}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-4 font-light"><strong className="text-white font-bold">Brand Injection Color:</strong> {brandColor.toUpperCase()}</Text>
        
        <Hr className="border-zinc-800 my-4" />
        
        <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider m-0 mb-2">Layout Structures:</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-1 font-light"><strong className="text-white font-bold">Hero Section:</strong> {heroStructure}</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-1 font-light"><strong className="text-white font-bold">Story & About:</strong> {storyStructure}</Text>
        <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Content Flow:</strong> {contentFlow}</Text>
      </Section>

      {/* 3. THE FOUNDER'S VISION & SCOPE */}
      <Section className="mb-8 bg-zinc-950/60 rounded-xl border-l-4 border-l-emerald-400 p-6 shadow-sm">
        <Text className="text-emerald-400 font-mono font-bold text-xs uppercase tracking-widest m-0 mb-4">
          3. The Founder's Vision & Scope
        </Text>
        
        <Text className="text-white font-bold text-xs uppercase tracking-wider m-0 mb-1">Headline Hook:</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-4 font-light bg-black/40 p-3 rounded border border-zinc-800">
          {tagline && tagline !== 'ARCHITECT_DELEGATED' ? `"${tagline}"` : '⚡ Copywriting Delegated to Architect'}
        </Text>

        <Text className="text-white font-bold text-xs uppercase tracking-wider m-0 mb-1">Elevator Pitch & Offering:</Text>
        <Text className="text-zinc-300 text-sm m-0 mb-4 font-light bg-black/40 p-3 rounded border border-zinc-800 leading-relaxed">
          {subtext || projectScope || 'No elevator pitch provided.'}
        </Text>

        {originStory && (
          <>
            <Text className="text-amber-400 font-bold text-xs uppercase tracking-wider m-0 mb-1">The Badass Brag (Origin Story):</Text>
            <Text className="text-zinc-300 text-sm m-0 mb-4 font-light bg-amber-500/5 p-3.5 rounded border border-amber-500/20 leading-relaxed italic">
              "{originStory}"
            </Text>
          </>
        )}

        {brainDump && (
          <>
            <Text className="text-teal-400 font-bold text-xs uppercase tracking-wider m-0 mb-1">Final Brain-Dump & Notes:</Text>
            <Text className="text-zinc-300 text-sm m-0 font-light bg-black/40 p-3.5 rounded border border-zinc-800 leading-relaxed">
              {brainDump}
            </Text>
          </>
        )}
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