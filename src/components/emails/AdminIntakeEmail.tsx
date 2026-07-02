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
      <Tailwind>
        <Head />
        <Body className="bg-black font-sans my-auto mx-auto p-4 text-white">
          
          <Container width={600} className="mx-auto my-8 bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            
            {/* The Blueprint Header */}
            <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-[#00D1FF]">
              <Heading className="text-[#00D1FF] text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
                New Project Application
              </Heading>
              <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
                Sector Zero Foundation
              </Text>
            </Section>
            
            <Section className="px-8 pt-8 pb-4">
              <Text className="text-white text-base m-0 mb-4">
                System Alert,
              </Text>
              <Text className="text-slate-300 text-sm leading-relaxed m-0">
                A new project application has been submitted to the queue. Review the dossier below and authorize the build inside the command center when ready.
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              
              {/* Data Box 1: Identity (Cyan Left Border) */}
              <Section className="mb-6 bg-slate-900 rounded-lg border-l-4 border-l-[#00D1FF] p-6">
                <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-4">
                  Identity & Footprint:
                </Text>
                
                <Text className="text-slate-300 text-sm m-0 mb-2">
                  <strong className="text-white">Name:</strong> {name}
                </Text>
                <Text className="text-slate-300 text-sm m-0 mb-2">
                  <strong className="text-white">Email:</strong> {email}
                </Text>
                {phone && (
                  <Text className="text-slate-300 text-sm m-0 mb-2">
                    <strong className="text-white">Phone:</strong> {phone}
                  </Text>
                )}
                <Text className="text-slate-300 text-sm m-0 mb-2 mt-4">
                  <strong className="text-white">Socials:</strong> {socials || 'None provided'}
                </Text>
                <Text className="text-slate-300 text-sm m-0">
                  <strong className="text-white">Existing URL:</strong> {existingWebsite || 'None provided'}
                </Text>
              </Section>

              {/* Data Box 2: Scope (Fuchsia Left Border) */}
              <Section className="mb-4 bg-slate-900 rounded-lg border-l-4 border-l-[#D946EF] p-6">
                <Text className="text-[#D946EF] font-bold text-xs uppercase tracking-widest m-0 mb-4">
                  Project Scope:
                </Text>
                <Text className="text-slate-300 text-sm leading-relaxed m-0 italic">
                  "{projectScope}"
                </Text>
              </Section>

            </Section>

            <Hr className="border-white/10 m-0" />

            <Section className="px-8 py-6 bg-black text-center">
              <Text className="text-slate-500 font-mono text-[10px] uppercase tracking-widest m-0">
                Alternative Solutions I/O LLC // Admin Telemetry
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}