// src/components/storefront/staging-review/types.ts

export interface StorefrontAuditData {
  id: string;
  business_name: string;
  slug: string;
  contact_email: string;
  primary_cta?: string;
}

export interface AuditStep {
  title: string;
  targetId: string;
  description: string;
  checks: string[];
}

export const AUDIT_ROADMAP: AuditStep[] = [
  {
    title: "Hero & First Impression",
    targetId: "hero",
    description: "This is your digital handshake. Let's verify the core hook.",
    checks: [
      "Tagline & Hook hit with the right energy",
      "Subtext accurately explains your offer",
      "Color palette & overall vibe feel authentic"
    ]
  },
  {
    title: "Story & Social Verification",
    targetId: "about",
    description: "Scroll down to your About section. Time to test your links.",
    checks: [
      "About Heading & Bio tell your true story",
      "Clicked all social media links (They must open correctly)",
      "Spelling and branding are 100% accurate"
    ]
  },
  {
    title: "Services & Layout Flow",
    targetId: "services",
    description: "Review how we styled your capabilities and service offerings.",
    checks: [
      "Service descriptions are sharp and clear",
      "Accordion / Card layout fits your business flow",
      "No missing services or pricing errors"
    ]
  },
  {
    title: "Gallery & Visual Proof",
    targetId: "gallery",
    description: "Inspect the imagery representing your work.",
    checks: [
      "Photos represent your highest standard of work",
      "Image cropping and display grid look clean",
      "Ready for public viewing"
    ]
  },
  {
    title: "Lead Capture & CTA Audit",
    targetId: "contact",
    description: "MANDATORY TEST: Submit a test inquiry through your contact form now.",
    checks: [
      "Physically filled out and submitted a test lead form",
      "Received the lead confirmation alert",
      "Primary action buttons point to the right destination"
    ]
  }
];