import React from 'react';
import { Html, Head, Body, Container, Section, Text, Heading, Hr, Tailwind, Button } from '@react-email/components';

interface PortalInviteEmailProps {
  operatorName: string;
  workspaceName: string;
  magicLink: string;
  role: string;
}

export default function PortalInviteEmail({
  operatorName = "Operator",
  workspaceName = "Your Workspace",
  magicLink = "https://alternativesolutions.io/login",
  role = "Client Owner"
}: PortalInviteEmailProps) {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="bg-black font-sans my-auto mx-auto p-4 text-white">
          
          <Container width={600} className="mx-auto my-8 bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            
            {/* The Blueprint Header */}
            <Section className="bg-slate-900 text-center pt-10 pb-8 border-b-2 border-[#00D1FF]">
              <Heading className="text-[#00D1FF] text-2xl md:text-3xl font-bold uppercase tracking-widest m-0 mb-3">
                Workspace Access Granted
              </Heading>
              <Text className="text-slate-400 font-mono text-[10px] uppercase tracking-widest m-0">
                Alternative Solutions // The Hub
              </Text>
            </Section>
            
            <Section className="px-8 pt-8 pb-4">
              <Text className="text-white text-base m-0 mb-4">
                Hey {operatorName},
              </Text>
              <Text className="text-slate-300 text-sm leading-relaxed m-0">
                The wait is over! Your <strong className="text-white">{workspaceName}</strong> workspace is officially live. I've got your <strong className="text-[#00D1FF]">{role}</strong> access all set up, and I am super pumped to finally get this into your hands.
              </Text>
            </Section>

            <Section className="px-8 pb-8">
              
              {/* Callout Box 1: Instructions (Cyan Left Border) */}
              <Section className="mb-6 bg-slate-900 rounded-lg border-l-4 border-l-[#00D1FF] p-6">
                <Text className="text-white font-bold text-xs uppercase tracking-widest m-0 mb-3">
                  How to use your space:
                </Text>
                <Text className="text-slate-300 text-sm leading-relaxed m-0">
                  Consider this our direct pipeline. You can securely drop files, mess around with live prototypes, and watch your business infrastructure come to life in real-time. No more losing things in endless email threads.
                </Text>
              </Section>

              {/* Callout Box 2: Warning (Fuchsia Left Border) */}
              <Section className="mb-8 bg-slate-900 rounded-lg border-l-4 border-l-[#D946EF] p-6">
                <Text className="text-[#D946EF] font-bold text-xs uppercase tracking-widest m-0 mb-3">
                  A quick heads-up:
                </Text>
                <Text className="text-slate-300 text-sm leading-relaxed m-0">
                  The portal is fully functional, but I'm actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If the system gets sassy, just let me know!
                </Text>
              </Section>

              <Section className="text-center mt-8 mb-4">
                <Text className="text-white text-sm font-bold m-0 mb-6">
                  Grab a coffee and let's build something awesome.
                </Text>
                <Button 
                  href={magicLink}
                  className="bg-[#00D1FF] text-black font-black px-10 py-4 rounded-lg text-xs uppercase tracking-widest no-underline inline-block"
                >
                  Enter The Hub
                </Button>
              </Section>

            </Section>

            <Hr className="border-white/10 m-0" />

            {/* Footer */}
            <Section className="px-8 py-6 bg-black">
              <Text className="text-slate-500 text-xs m-0 mb-1">
                Best,
              </Text>
              <Text className="text-[#00D1FF] font-bold text-sm m-0">
                Courtney M. Sulenski
              </Text>
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}