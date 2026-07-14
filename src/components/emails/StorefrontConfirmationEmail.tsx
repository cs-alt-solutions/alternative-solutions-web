/* src/components/emails/StorefrontConfirmationEmail.tsx */
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Tailwind } from '@react-email/components';

interface StorefrontConfirmationEmailProps {
  name: string;
  projectName: string;
}

export default function StorefrontConfirmationEmail({ name, projectName }: StorefrontConfirmationEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-black font-sans my-auto mx-auto p-4 text-white">
          <Container width={600} className="mx-auto my-8 bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            
            {/* The Blueprint Header */}
            <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-[#10b981]">
              <Heading className="text-[#10b981] text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
                Application Received
              </Heading>
              <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
                Sector Zero Foundation
              </Text>
            </Section>

            <Section className="px-8 pt-8 pb-4">
              <Text className="text-white text-base m-0 mb-4">
                Hey {name},
              </Text>
              <Text className="text-slate-300 text-sm leading-relaxed m-0">
                I've successfully received your application for <strong className="text-white">{projectName}</strong>. 
                I’m currently reviewing your specs and vision to ensure we’re ready to build something that actually performs.
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              {/* Callout Box: Next Steps */}
              <Section className="mb-6 bg-slate-900 rounded-lg border-l-4 border-l-[#10b981] p-6">
                <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-3">
                  What happens next?
                </Text>
                <Text className="text-slate-300 text-sm leading-relaxed m-0">
                  I personally review every application that hits my queue. If your project aligns with the Alternative Solutions framework, I’ll send over an invite to your dedicated secure portal where we’ll map out the final architecture.
                </Text>
              </Section>
              
              <Text className="text-slate-400 text-xs italic m-0">
                Talk soon,
              </Text>
              <Text className="text-[#10b981] font-bold text-sm m-0">
                Courtney M. Sulenski
              </Text>
            </Section>

            <Hr className="border-white/10 m-0" />
            <Section className="px-8 py-6 bg-black text-center">
              <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest m-0">
                Alternative Solutions I/O LLC // Build Log
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}