import React from 'react';
import { Section, Text, Heading, Hr } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/config/emails';

export interface StorefrontConfirmationEmailProps {
  name?: string;
  projectName?: string;
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
  selectedPlan = 'Standard',
  selectedVibe = 'Midnight Onyx',
  brandColor = 'Cyan',
  heroStructure = 'Centered Impact',
  storyStructure = 'Classic Split',
  contentFlow = 'Stacked Flow',
  originStory
}: StorefrontConfirmationEmailProps) {
  const copy = EMAIL_COPY.STOREFRONT_CONFIRMATION;

  return (
    <BaseEmailLayout>
      {/* CELEBRATORY HEADER */}
      <Section className="bg-zinc-900/80 text-left p-6 md:p-8 border-b-2 border-teal-400 rounded-t-xl -mt-10 -mx-10 mb-8">
        <Text className="text-teal-400 font-mono text-xs uppercase tracking-widest m-0 mb-1">
          {copy.HEADER}
        </Text>
        <Heading className="text-white text-2xl md:text-3xl font-black tracking-tight uppercase m-0">
          {copy.TITLE_START}{name}.
        </Heading>
      </Section>
      
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6 font-light">
        {copy.BODY_START}<strong className="text-white font-bold">{projectName}</strong>{copy.BODY_END}
      </Text>
      
      {/* 🚀 THE BLUEPRINT RECEIPT */}
      <Section className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl p-6 mb-8 shadow-sm">
        <Text className="text-teal-400 font-mono text-xs font-bold uppercase tracking-widest m-0 mb-4">
          {copy.RECEIPT_TITLE}
        </Text>
        
        <div className="space-y-2">
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.REC_INFRA}</strong> {String(selectedPlan).toUpperCase()}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.REC_VIBE}</strong> {String(selectedVibe).toUpperCase()}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.REC_ACCENT}</strong> {String(brandColor).toUpperCase()}</Text>
        </div>

        <Hr className="border-zinc-800/80 my-4" />

        <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider m-0 mb-2">{copy.FLOW_TITLE}</Text>
        <div className="space-y-1.5">
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.FLOW_HERO}</strong> {heroStructure}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.FLOW_STORY}</strong> {storyStructure}</Text>
          <Text className="text-zinc-300 text-sm m-0 font-light"><strong className="text-white font-bold">{copy.FLOW_PORTFOLIO}</strong> {contentFlow}</Text>
        </div>

        {originStory && (
          <>
            <Hr className="border-zinc-800/80 my-4" />
            <Text className="text-amber-400 font-mono text-xs uppercase tracking-wider m-0 mb-1">{copy.BRAG_TITLE}</Text>
            <Text className="text-zinc-300 text-xs leading-relaxed m-0 italic bg-black/50 p-3.5 rounded border border-zinc-800/80">
              "{originStory}"
            </Text>
          </>
        )}
      </Section>

      {/* 🚀 THE PLEDGE / RULES OF ENGAGEMENT */}
      <Section className="bg-zinc-900/40 border-l-4 border-l-cyan-400 p-6 rounded-r-xl mb-8">
        <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-2">
          {copy.PLEDGE_TITLE}
        </Text>
        <Text className="text-zinc-400 text-xs leading-relaxed m-0 font-light">
          {copy.PLEDGE_BODY}
        </Text>
      </Section>

      {/* WHAT HAPPENS NEXT */}
      <Text className="text-white font-bold text-sm uppercase tracking-wider m-0 mb-2">
        {copy.NEXT_TITLE}
      </Text>
      <Text className="text-zinc-300 text-sm leading-relaxed m-0 mb-8 font-light">
        {copy.NEXT_BODY}
      </Text>
      
      <Text className="text-zinc-400 text-sm m-0 mb-1 font-light">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-black text-base uppercase tracking-wide m-0">{copy.NAME}</Text>
      <Text className="text-teal-400 font-mono text-xs m-0">{copy.TITLE}</Text>

      <Hr className="border-zinc-800 my-8" />

      <Section className="text-center">
        <Text className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest m-0">
          Alternative Solutions Input Output LLC • Williamsburg, VA
        </Text>
      </Section>
    </BaseEmailLayout>
  );
}