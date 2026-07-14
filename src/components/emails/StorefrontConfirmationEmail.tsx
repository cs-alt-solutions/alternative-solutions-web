/* src/components/emails/StorefrontConfirmationEmail.tsx */
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Tailwind } from '@react-email/components';

interface StorefrontConfirmationEmailProps {
  name: string;
  projectName: string;
}

export default function StorefrontConfirmationEmail({ name, projectName }: StorefrontConfirmationEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-[#050505] font-sans my-auto mx-auto p-4 text-white">
          <Container width={600} className="mx-auto my-8 bg-[#0a0a0c] rounded-2xl border border-zinc-800 shadow-2xl p-10">
            
            <Heading className="text-white text-2xl font-black uppercase tracking-tight m-0 mb-6">
              Alternative Solutions
            </Heading>

            <Text className="text-white text-lg font-medium m-0 mb-4">
              Hey {name},
            </Text>

            <Text className="text-zinc-300 text-base leading-relaxed m-0 mb-6">
              Thanks for reaching out! I’ve got the details for <strong>{projectName}</strong> and I’m definitely digging what you’ve got in mind.
            </Text>

            <Section className="bg-zinc-900/50 border-l-4 border-l-cyan-500 p-6 rounded-r-lg mb-6">
              <Text className="text-zinc-400 text-sm leading-relaxed m-0">
                Just a heads-up—it’s just me over here running the show, so I’m the one who personally reviews every application. I’m going to look over what you sent, and I’ll be back in touch soon so we can figure out what’s next. No hoops, no corporate fluff—just us figuring out the architecture.
              </Text>
            </Section>
            
            <Text className="text-zinc-400 text-sm m-0 mb-2">Talk soon,</Text>
            <Text className="text-white font-bold text-base m-0">Courtney</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}