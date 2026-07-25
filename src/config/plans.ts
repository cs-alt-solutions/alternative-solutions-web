/* src/config/plans.ts */

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  stripeLink: string;
  description: string;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'standard',
    name: 'The Standard',
    price: '5',
    stripeLink: 'https://support.alternativesolutions.io/b/standard_5',
    description: 'Get your business online today without the DIY headache.',
    features: [
      'Full custom website build & deployment.',
      'Lightning-fast, enterprise-grade hosting.',
      'Ongoing system maintenance & security.',
      'Your spot on the Alternative Solutions live grid.'
    ]
  },
  {
    id: 'professional',
    name: 'The Professional',
    price: '15',
    stripeLink: 'https://support.alternativesolutions.io/b/professional_15',
    description: 'Advanced setup with direct connection to your own custom web address.',
    features: [
      'Everything included in The Standard plan.',
      'Expert guidance on securing your custom .com domain.',
      'I handle 100% of the technical DNS connection.',
      'Full, ongoing management of your web architecture.'
    ]
  }
];