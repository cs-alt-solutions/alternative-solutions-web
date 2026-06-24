/* src/components/emails/AdminIntakeEmail.tsx */
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Tailwind } from '@react-email/components';

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
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-black font-sans my-auto mx-auto px-2 py-8">
          <Container className="border border-cyan-900/50 rounded-xl p-8 bg-zinc-950 max-w-2xl mx-auto shadow-2xl">
            
            {/* System Header */}
            <Section className="mb-8">
              <Text className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest mb-2">
                /// SYSTEM TRANSMISSION
              </Text>
              <Heading className="text-white text-2xl font-black uppercase tracking-tight m-0">
                New Sector Zero Applicant
              </Heading>
            </Section>

            <Hr className="border border-white/10 my-6" />

            {/* Applicant Identity */}
            <Section className="mb-6">
              <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest m-0 mb-1">
                Identity Data
              </Text>
              <Text className="text-white text-base font-bold m-0 mb-1">
                {name}
              </Text>
              <Text className="text-cyan-400 text-sm m-0 mb-1">
                {email}
              </Text>
              {phone && (
                <Text className="text-slate-300 text-sm m-0">
                  Phone: {phone}
                </Text>
              )}
            </Section>

            {/* Digital Footprint */}
            <Section className="mb-6 p-4 bg-black/50 border border-white/5 rounded-lg">
              <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest m-0 mb-3">
                Digital Footprint
              </Text>
              
              <Text className="text-slate-300 text-sm m-0 mb-2 font-mono">
                <span className="text-white font-bold">SOCIALS:</span> {socials || 'N/A'}
              </Text>
              
              <Text className="text-slate-300 text-sm m-0 font-mono">
                <span className="text-white font-bold">EXISTING URL:</span> {existingWebsite || 'N/A'}
              </Text>
            </Section>

            {/* Vision & Scope */}
            <Section className="mb-8">
              <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest m-0 mb-2">
                Project Scope & Vision
              </Text>
              <Text className="text-slate-300 text-sm leading-relaxed m-0 border-l-2 border-cyan-500/50 pl-4 py-1">
                "{projectScope}"
              </Text>
            </Section>

            <Hr className="border border-white/10 my-6" />

            {/* Footer */}
            <Section>
              <Text className="text-slate-600 font-mono text-[10px] uppercase tracking-widest m-0 text-center">
                Alternative Solutions I/O LLC • Command Center
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}