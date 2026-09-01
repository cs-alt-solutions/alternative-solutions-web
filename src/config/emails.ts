// src/config/emails.ts

export const EMAIL_ASSETS = {
  LOGO_URL: 'https://alternativesolutions.io/logo.png', // Update to full CDN URL for production
};

export const BRAND_CLASSES = {
  // Centralizing our Tailwind classes for global consistency (No-Inline Policy)
  ACCENT_BORDER: 'border-b-2 border-cyan-400',
  QUOTE_BLOCK: 'bg-zinc-950 border-l-4 border-cyan-400 p-6 rounded-r-xl',
  BUTTON: 'bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl',
  TEXT_MUTED: 'text-zinc-500 text-xs text-center',
};

// Single Source of Truth for the Sign-off
const STANDARD_SIGNATURE = {
  SIGN_OFF: "Talk soon,",
  NAME: "Courtney Sulenski",
  TITLE: "Lead Architect • Alternative Solutions"
};

export const EMAIL_COPY = {
  
  // 1. THE INTAKE PIPELINE
  STOREFRONT_CONFIRMATION: {
    HEADER: "Intake Received",
    TITLE_START: "Let's build, ",
    BODY_START: "I have received the foundational details for ",
    BODY_END: ". I'm officially initiating the digital recon phase.",
    RECEIPT_TITLE: "Application Summary",
    REC_INFRA: "Target Infrastructure:",
    PLEDGE_TITLE: "Rules of Engagement",
    PLEDGE_BODY: "As a reminder, you are not paying for anything today. I am going to build a working prototype based on your digital footprint. We only lock in your subscription when you review the prototype and say, 'Yeah, this is pretty cool. Let's go.'",
    NEXT_TITLE: "What Happens Next?",
    NEXT_BODY: "Hang tight. I am reviewing your social links and building out the initial structure. I will reach out shortly with a staging link for you to review.",
    ...STANDARD_SIGNATURE
  },
  
  ADMIN_INTAKE: {
    SUBJECT: "🚨 New Application: {businessName}",
    HEADER_TITLE: "NEW STOREFRONT INTAKE",
    GREETING: "A new prospect has submitted their basic details.",
    BODY: "Review their identity and footprint below before logging into the Command Center to initiate the discovery phase.",
    SECTIONS: {
      IDENTITY: "Identity & Routing",
      PRIORITY_WARNING: "⚠️ Priority Queue Fast-Track Requested ($1 Upgrade)"
    },
    LABELS: {
      BUSINESS_NAME: "Business Name:",
      CONTACT: "Point of Contact:",
      EMAIL: "Email Routing:",
      PHONE: "Phone Number:",
      TIER: "Requested Tier:",
      DOMAIN: "Existing Domain:",
      SOCIALS: "Digital Footprint & Socials:"
    }
  },

  // 2. THE ACCESS PIPELINE
  MAGIC_LINK: {
    HEADER: 'Secure Authentication',
    SUBHEADER: 'Alternative Solutions',
    GREETING: 'Hey there,',
    INTRO: 'You requested a secure magic link to jump back into your workspace.',
    BODY: "I don't do clunky passwords around here. Just click the button below to instantly authenticate your session, and let's get back to building.",
    CTA_BUTTON: 'Authenticate Session',
    ...STANDARD_SIGNATURE
  },

  PORTAL_INVITE: {
    HEADER: 'Workspace Access Granted',
    SUBHEADER: 'The Hub',
    GREETING: 'Hey',
    INTRO_START: 'The wait is over! Your ',
    INTRO_MID: ' workspace is officially live. I\'ve got your ',
    INTRO_END: ' access all set up, and I am super pumped to finally get this into your hands.',
    USE_SPACE_TITLE: 'How to use your space:',
    USE_SPACE_BODY: 'Consider this my direct pipeline to you. You can securely drop files, mess around with live prototypes, and watch your business infrastructure come to life in real-time. No more losing things in endless email threads.',
    HEADS_UP_TITLE: 'A quick heads-up:',
    HEADS_UP_BODY: 'Your workspace is fully functional, but I\'m actively in the trenches building and pushing updates. You might notice a little digital dust or a clunky button here and there. If the system gets sassy, just let me know!',
    CTA_TEXT: "Grab a coffee and let's build something awesome.",
    CTA_BUTTON: 'Enter Your Workspace',
    ...STANDARD_SIGNATURE
  },

  // 3. THE REVIEW & DEPLOYMENT PIPELINE
  STAGING_REVIEW: {
    HEADER: 'Build Progress',
    SUBHEADER: 'Staging Environment',
    GREETING: 'Hey',
    BODY_1: "Here is a quick preview of what your digital storefront's going to look like so far. We can definitely make adjustments together, but I wanted to show you the progress before you lock in your subscription.",
    INSTRUCTIONS_TITLE: 'What happens next?',
    INSTRUCTIONS_INTRO: 'Instead of going back and forth over email, I want to get you set up in your private client portal so we can collaborate and finish this efficiently.',
    
    INSTRUCTION_1_TITLE: '1. Take a look',
    INSTRUCTION_1_BODY: 'Click the link, view the staging progress, and see the foundation I am building for you.',
    
    INSTRUCTION_2_TITLE: '2. Activate subscription',
    INSTRUCTION_2_BODY: 'When you are ready to proceed, click the button on the staging widget to set up your subscription.',
    
    INSTRUCTION_3_TITLE: '⚡ 3. Enter your portal',
    INSTRUCTION_3_BODY: 'Once active, you unlock your portal. That is where you will upload your images and drop your specific tweaks so I can finish getting you exactly where you need to be.',
    
    CTA_BUTTON: 'Access your staging environment',
    ...STANDARD_SIGNATURE
  },

  STAGING_RECEIPT: {
    CLIENT_APPROVED: 'Thank you for completing your live staging review. You have verified all checkpoints with zero requested changes. This build is officially locked in my dev queue for final deployment. Keep an eye out for your official hosting activation link.',
    CLIENT_CHANGES: 'Thank you for completing your live staging review. I have logged your verified checkpoints and adjustment requests below. I am jumping under the hood to execute your exact tweak list in one clean pass. Once applied, I will send an updated link for your final approval.',
    ADMIN_APPROVED: 'Client has locked the build! Verify their recurring subscription plan is active and initiate domain DNS wiring protocols.',
    ADMIN_CHANGES: 'Client requested specific adjustments. Open the active codebase, apply the tweak list in a single pass, and push to staging for their second review.',
    ...STANDARD_SIGNATURE
  },

  // 4. THE MANUAL FALLBACK & ACTIVATION PIPELINE
  MANUAL_CHECKOUT: {
    HEADER: 'Architecture Sign-Off',
    SUBHEADER: 'Subscription Initialization',
    GREETING: 'Hey',
    BODY: 'As requested, here is the secure link to initialize your monthly hosting and infrastructure subscription. Once this is activated, I will flip the switch and route your domain to the live server!',
    CTA_BUTTON: 'Activate Subscription',
    ...STANDARD_SIGNATURE
  },

  SUBSCRIPTION_ACTIVATION: {
    HEADER: 'Green Light',
    SUBHEADER: 'Ready To Launch',
    GREETING: 'Hey',
    BODY_START: 'Great news—I have everything for ',
    BODY_END: ' completely dialed in and ready to go live.',
    DETAILS_TITLE: 'The Details',
    PLAN_LABEL: 'Selected Tier:',
    PRICE_LABEL: 'Subscription:',
    NEXT_STEPS_TITLE: 'What happens next?',
    NEXT_STEPS_BODY: "Just click the button below to lock in your secure hosting subscription. The second your payment clears, I get a ping on my end, and I'll flip the switch to put your site live. Let's get this thing out there.",
    CTA_BUTTON: 'Activate & Go Live',
    ...STANDARD_SIGNATURE
  },

  // RESTORED: Your API route needs this to compile the email subject!
  INVITE_SUBJECT: 'Access Granted: Secure Workspace'
};