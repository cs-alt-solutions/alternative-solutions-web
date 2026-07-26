import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/utils/glossary';

// 🚀 EXPANDED INTERFACE: Receives their full build specs to generate their receipt
export interface StorefrontConfirmationEmailProps {
  name: string;
  projectName: string;
  selectedPlan?: string;
  selectedVibe?: string;
  brandColor?: string;
  heroStructure?: string;
  storyStructure?: string;
  contentFlow?: string;
  originStory?: string;
}

export default function StorefrontConfirmationEmail({ 
  name = 'Founder', 
  projectName = 'Your Empire',
  selectedPlan = 'Standard Starter',
  selectedVibe = 'Midnight Onyx',
  brandColor = 'Cyan',
  heroStructure = 'Centered Impact',
  storyStructure = 'Classic Split',
  contentFlow = 'Stacked Flow',
  originStory
}: StorefrontConfirmationEmailProps) {
  const copy = EMAIL_COPY?.STOREFRONT_CONFIRMATION || {};

  return (
    <BaseEmailLayout>
      {/* CELEBRATORY HEADER */}
      <Section className="bg-zinc-900/80 text-left p-6 md:p-8 border-b-2 border-teal-400 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-teal-400 font-mono text-xs uppercase tracking-widest m-0 mb-1">
          Transmission Confirmed // Build Queue
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase m-0">
          We have your blueprint, {name}.
        </Heading>
      </Section>
      
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        You made the decision to step out and build your own empire with <strong className="text-white font-bold">{projectName}</strong>, and that takes serious grit. I have your complete application file in my hands and am taking over the heavy tech lifting so you can focus on your business.
      </Text>
      
      {/* 🚀 THE BLUEPRINT RECEIPT (Eliminates "Outer Space" Anxiety) */}
      <Section className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 mb-8 shadow-sm">
        <Text className="text-teal-400 font-mono text-xs font-bold uppercase tracking-widest m-0 mb-4">
          Your Storefront Blueprint Receipt
        </Text>
        
        <div className="space-y-2">
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Selected Plan Tier:</strong> {String(selectedPlan).toUpperCase()}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Foundational Vibe:</strong> {String(selectedVibe).toUpperCase()}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Brand Injection Color:</strong> {String(brandColor).toUpperCase()}</Text>
        </div>

        <Hr className="border-zinc-800/80 my-4" />

        <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider m-0 mb-2">Engine Layout Flow:</Text>
        <div className="space-y-1.5">
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Hero Section:</strong> {heroStructure}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Story & About:</strong> {storyStructure}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">Content Display:</strong> {contentFlow}</Text>
        </div>

        {originStory && (
          <>
            <Hr className="border-zinc-800/80 my-4" />
            <Text className="text-amber-400 font-mono text-xs uppercase tracking-wider m-0 mb-1">Your Badass Brag Loaded Into Memory:</Text>
            <Text className="text-zinc-300 text-xs leading-relaxed m-0 italic bg-black/50 p-3.5 rounded border border-zinc-800/80">
              "{originStory}"
            </Text>
          </>
        )}
      </Section>

      {/* 🚀 THE RATE LOCK & UPGRADE PLEDGE IN WRITING */}
      <Section className="bg-zinc-900/40 border-l-4 border-l-cyan-400 p-6 rounded-r-xl mb-8">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-2">
          Your Foundational Rate Lock Guarantee
        </Text>
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 font-light">
          Per our Founder's Pledge, your pricing is locked in for life <strong className="text-zinc-200 font-medium">for the tier you selected today</strong>. As I continuously push platform upgrades and enhance our infrastructure, your foundational price will never increase when public rates go up. If you ever decide to upgrade to a higher tier packed with new features later, you will upgrade at that tier's active market rate—keeping everything fair, transparent, and built for growth.
        </Text>
      </Section>

      {/* WHAT HAPPENS NEXT */}
      <Text className="text-white font-bold text-sm uppercase tracking-wider m-0 mb-2">
        What happens next?
      </Text>
      <Text className="text-zinc-300 text-sm leading-relaxed m-0 mb-8 font-light">
        I am currently prepping your digital canvas and routing your social links. You will receive direct updates and preview links straight to this email inbox. If you forgot to mention a specific feature, want to tweak a color, or just have a sudden burst of inspiration, <strong className="text-white font-bold">simply hit reply to this email</strong> and it goes straight to my personal terminal.
      </Text>
      
      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">Let's build something badass,</Text>
      <Text className="text-white font-black text-base uppercase tracking-wide m-0">Courtney Sulenski</Text>
      <Text className="text-teal-400 font-mono text-xs m-0">Founder & Lead Solutions Architect // Alternative Solutions</Text>

      <Hr className="border-zinc-800 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}