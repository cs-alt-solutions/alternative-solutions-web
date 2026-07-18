// src/emails/StorefrontConfirmationEmail.tsx
import React from 'react';
import { Section, Text } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';
import { EMAIL_COPY } from '@/utils/glossary';

interface StorefrontConfirmationEmailProps {
  name: string;
  projectName: string;
}

export default function StorefrontConfirmationEmail({ name, projectName }: StorefrontConfirmationEmailProps) {
  const copy = EMAIL_COPY.STOREFRONT_CONFIRMATION;

  return (
    <BaseEmailLayout>
      <Text className="text-white text-lg font-medium m-0 mb-4">
        {copy.GREETING} {name},
      </Text>
      
      <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6">
        {copy.INTRO} <strong>{projectName}</strong> {copy.INTRO_END}
      </Text>
      
      <Section className="bg-zinc-950/50 border-l-4 border-l-cyan-400 p-6 rounded-r-lg mb-6">
        <Text className="text-zinc-400 text-sm leading-relaxed m-0">
          {copy.BODY}
        </Text>
      </Section>
      
      <Text className="text-zinc-400 text-sm m-0 mb-2">{copy.SIGN_OFF}</Text>
      <Text className="text-white font-bold text-base m-0">{copy.SIGNATURE}</Text>
    </BaseEmailLayout>
  );
}