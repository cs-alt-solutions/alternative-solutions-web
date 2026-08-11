import React from 'react';
import { Section, Text, Heading, Button } from '@react-email/components';
import BaseEmailLayout from '@/components/emails/BaseEmailLayout';

export default function SubscriptionActivationEmail({
  clientName = "Client",
  projectName = "Your Storefront",
  checkoutUrl,
  planName = "Foundation Plan",
  price = "$5.00/mo"
}: {
  clientName?: string;
  projectName?: string;
  checkoutUrl: string;
  planName?: string;
  price?: string;
}) {
  return (
    <BaseEmailLayout>
      <Section className="mt-8">
        <Heading className="text-2xl font-black text-cyan-400 uppercase tracking-widest mb-4">
          Storefront Deployed
        </Heading>
        <Text className="text-zinc-300 text-base leading-relaxed mb-6">
          System update for {clientName},
        </Text>
        <Text className="text-zinc-300 text-base leading-relaxed mb-6">
          Great news—the digital storefront architecture for <strong className="text-white">{projectName}</strong> is fully approved and staged for live edge deployment.
        </Text>
        
        <Section className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 mb-8 border-l-4 border-l-cyan-500">
          <Heading className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-3 m-0">
            Activation Details
          </Heading>
          <Text className="text-zinc-400 text-sm m-0 mb-2">
            <strong className="text-zinc-100">Selected Tier:</strong> {planName}
          </Text>
          <Text className="text-zinc-400 text-sm m-0">
            <strong className="text-zinc-100">Subscription:</strong> {price}
          </Text>
        </Section>

        <Text className="text-zinc-300 text-base leading-relaxed mb-8">
          To finalize your deployment and activate hosting, please securely process your subscription using the secure link below. Once processed, your system will automatically go live.
        </Text>

        <Button
          href={checkoutUrl}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-black uppercase tracking-widest py-4 px-8 rounded-lg text-sm text-center block w-full shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all"
        >
          Initialize Checkout
        </Button>
      </Section>
    </BaseEmailLayout>
  );
}