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
  SIGN_OFF: "Standing by,",
  NAME: "Courtney Sulenski",
  TITLE: "Lead Solutions Architect • Alternative Solutions"
};

export const EMAIL_COPY = {
  
  // 1. THE INTAKE PIPELINE
  STOREFRONT_CONFIRMATION: {
    HEADER: "Application Locked In • Build Queue Active",
    TITLE_START: "I have your blueprint, ",
    BODY_START: "You made the decision to step out and build your own empire with ",
    BODY_END: ", and that takes serious grit. I have your complete application file in my hands and am taking over the heavy tech lifting so you can focus on running your business.",
    
    RECEIPT_TITLE: "Your Custom Build Specs",
    REC_INFRA: "Infrastructure:",
    REC_VIBE: "Aesthetic Vibe:",
    REC_ACCENT: "Brand Accent:",
    
    FLOW_TITLE: "The Architecture Flow:",
    FLOW_HERO: "Top Greeting:",
    FLOW_STORY: "Brand Story:",
    FLOW_PORTFOLIO: "Portfolio & Services:",
    
    BRAG_TITLE: "The Badass Brag:",
    
    GUARANTEE_TITLE: "Your Foundational Rate Lock Guarantee",
    GUARANTEE_BODY: "Per our Founder's Pledge, your pricing is locked in for life for the tier you selected today. As I continuously push platform upgrades and enhance the infrastructure, your foundational price will never increase when public rates go up. If you ever decide to upgrade to a higher tier packed with new features later, you will upgrade at that tier's active market rate—keeping everything fair, transparent, and built for growth.",
    
    NEXT_TITLE: "What happens next?",
    NEXT_BODY: "I am currently prepping your digital canvas and routing your social links. You will receive direct updates and preview links straight to this email inbox. If you forgot to mention a specific feature, want to tweak a color, or just have a sudden burst of inspiration, simply hit reply to this email and it goes straight to my personal terminal.",
    
    ...STANDARD_SIGNATURE
  },
  
  ADMIN_INTAKE: {
    HEADER: 'New Project Application',
    SUBHEADER: 'System Intake',
    GREETING: 'System Alert,',
    INTRO: 'A new project application has been submitted to the queue. Review the dossier below and authorize the build inside the command center when ready.',
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
    BODY_1: "here is a quick preview of what your digital storefront's going to look like so far. We can definitely make adjustments, but I wanted to show you the progress before we get your subscription going.",
    INSTRUCTIONS_TITLE: 'What happens next?',
    INSTRUCTIONS_INTRO: 'Instead of going back and forth over email, I want to get you set up in your private client portal so we can collaborate and finish this efficiently.',
    
    INSTRUCTION_1_TITLE: '1. Take a look',
    INSTRUCTION_1_BODY: 'Click the link, view the staging progress, and see the foundation we are building.',
    
    INSTRUCTION_2_TITLE: '2. Activate subscription',
    INSTRUCTION_2_BODY: 'When you are ready to proceed, click the button on the staging widget to set up your subscription.',
    
    INSTRUCTION_3_TITLE: '⚡ 3. Enter your portal',
    INSTRUCTION_3_BODY: 'Once active, you unlock your portal. That is where you will upload your images and drop your specific tweaks so we can finish getting you exactly where you need to be.',
    
    CTA_BUTTON: 'Access your staging environment',
    ...STANDARD_SIGNATURE
  },

  STAGING_RECEIPT: {
    CLIENT_APPROVED: 'Thank you for completing your live staging review. You have verified all checkpoints with zero requested changes. This build is officially locked in our dev queue for final deployment. Keep an eye out for your official hosting activation link.',
    CLIENT_CHANGES: 'Thank you for completing your live staging review. We have logged your verified checkpoints and adjustment requests below. Our team is jumping under the hood to execute your exact tweak list in one clean pass. Once applied, we will send an updated link for your final approval.',
    ADMIN_APPROVED: 'Client has locked the build! Verify their recurring subscription plan is active and initiate domain DNS wiring protocols.',
    ADMIN_CHANGES: 'Client requested specific adjustments. Open the active codebase, apply the tweak list in a single pass, and push to staging for their second review.',
    ...STANDARD_SIGNATURE
  },

  // 4. THE MANUAL FALLBACK & ACTIVATION PIPELINE
  MANUAL_CHECKOUT: {
    HEADER: 'Architecture Sign-Off',
    SUBHEADER: 'Subscription Initialization',
    GREETING: 'Hey',
    BODY: 'As requested, here is the secure link to initialize your monthly hosting and infrastructure subscription. Once this is activated, we will flip the switch and route your domain to the live server!',
    CTA_BUTTON: 'Activate Subscription',
    ...STANDARD_SIGNATURE
  },

  SUBSCRIPTION_ACTIVATION: {
    HEADER: 'Storefront Approved',
    SUBHEADER: 'Ready for Deployment',
    GREETING: 'Hey',
    BODY_START: 'Great news—your digital storefront for ',
    BODY_END: ' is fully approved and ready to be deployed to the live edge network.',
    DETAILS_TITLE: 'Activation Details',
    PLAN_LABEL: 'Selected Tier:',
    PRICE_LABEL: 'Subscription:',
    NEXT_STEPS_TITLE: 'What happens next?',
    NEXT_STEPS_BODY: 'Click the button below to initialize your monthly hosting subscription via our secure Stripe checkout. The second your payment clears, I get a ping, and I will instantly route your domain to the live server. It’s go time.',
    CTA_BUTTON: 'Initialize Subscription',
    ...STANDARD_SIGNATURE
  },

  // RESTORED: Your API route needs this to compile the email subject!
  INVITE_SUBJECT: 'Access Granted: Secure Workspace'
};