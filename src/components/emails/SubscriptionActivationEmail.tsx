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
        <Heading className="text-2xl font-black text-white uppercase tracking-wider mb-4">
          Storefront Approved
        </Heading>
        <Text className="text-zinc-300 text-base leading-relaxed mb-6">
          Hey {clientName},
        </Text>
        <Text className="text-zinc-300 text-base leading-relaxed mb-6">
          Great news—your digital storefront for <strong>{projectName}</strong> is fully approved and ready to be deployed to the live edge network. 
        </Text>
        
        <Section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6 border-l-4 border-l-emerald-500">
          <Heading className="text-xs font-black text-emerald-400 uppercase tracking-widest mb-2 m-0">
            Activation Details
          </Heading>
          <Text className="text-zinc-300 m-0 mb-1">
            <strong className="text-white">Selected Tier:</strong> {planName}
          </Text>
          <Text className="text-zinc-300 m-0">
            <strong className="text-white">Subscription:</strong> {price}
          </Text>
        </Section>

        <Text className="text-zinc-300 text-base leading-relaxed mb-8">
          To finalize your deployment and activate your hosting, please securely process your subscription using the link below.
        </Text>

        <Button
          href={checkoutUrl}
          className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest py-3 px-6 rounded-md text-sm text-center block w-full"
        >
          Activate Subscription
        </Button>
      </Section>
    </BaseEmailLayout>
  );
}