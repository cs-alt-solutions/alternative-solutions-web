/* src/components/emails/StorefrontConfirmationEmail.tsx */
import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Tailwind, Img } from '@react-email/components';

interface StorefrontConfirmationEmailProps {
  name: string;
  projectName: string;
}

export default function StorefrontConfirmationEmail({ name, projectName }: StorefrontConfirmationEmailProps) {
  // Use a public URL for your logo, e.g., from your Supabase storage bucket
  const logoUrl = 'https://your-domain.com/logo.png'; 

  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-[#050505] font-sans my-auto mx-auto p-4 text-white">
          {/* Main Container */}
          <Container width={600} className="mx-auto my-8 bg-[#0a0a0c] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
            
            {/* Watermark Logo Layer */}
            <Img
              src={logoUrl}
              width={300}
              height={300}
              alt="Watermark"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none z-0"
            />

            {/* Content Layer (z-10 ensures it sits on top) */}
            <Section className="relative z-10">
              <Section className="bg-[#050505] text-left pt-12 pb-6 px-10 border-b border-zinc-800">
                <Heading className="text-white text-2xl font-black uppercase tracking-tight m-0">
                  Alternative Solutions
                </Heading>
                <Text className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2 m-0">
                  Application Received
                </Text>
              </Section>

              <Section className="px-10 pt-10 pb-4">
                <Text className="text-white text-lg font-medium m-0 mb-4">
                  Hey {name},
                </Text>
                <Text className="text-zinc-300 text-base leading-relaxed m-0">
                  Thanks for reaching out! I’ve got the details for {projectName} and I’m genuinely excited to dig into it.
                </Text>
              </Section>

              <Section className="px-10 pb-10">
                <Section className="mb-8 bg-zinc-900/50 border-l-4 border-l-cyan-500 p-6 rounded-r-lg">
                  <Text className="text-white font-bold text-sm m-0 mb-2">
                    What happens next?
                  </Text>
                  <Text className="text-zinc-400 text-sm leading-relaxed m-0">
                    Since it’s just me over here running the show, I personally review every application. I’ll look over what you sent, and I’ll be back in touch soon so we can figure out the next steps.
                  </Text>
                </Section>
                
                <Text className="text-zinc-400 text-sm m-0 mb-2">Talk soon,</Text>
                <Text className="text-white font-bold text-base m-0">Courtney</Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}