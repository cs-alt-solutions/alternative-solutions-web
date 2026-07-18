// src/components/emails/BaseEmailLayout.tsx
import React from 'react';
import { Html, Head, Body, Container, Section, Tailwind, Img } from '@react-email/components';
import { EMAIL_ASSETS } from '@/config/emails'; 

interface BaseEmailLayoutProps {
  children: React.ReactNode;
}

export default function BaseEmailLayout({ children }: BaseEmailLayoutProps) {
  return (
    <Html>
      {/* We moved Tailwind OUTSIDE so it wraps the Head component */}
      <Tailwind>
        <Head /> 
        <Body className="bg-black font-sans my-auto mx-auto p-4 text-white">
          <Container width={600} className="mx-auto my-8 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
            
            <Section className="mt-10 mb-6 text-center w-full flex justify-center">
              <Img
                src={EMAIL_ASSETS.LOGO_URL}
                width="140"
                height="auto"
                alt="Brand Logo"
                className="mx-auto block" 
              />
            </Section>

            <Section className="px-10 pb-10">
                {children}
            </Section>

          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}