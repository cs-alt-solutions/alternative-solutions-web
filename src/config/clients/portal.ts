/* src/config/clients/portal.ts */

export const PORTAL_COPY = {
  header: {
    signOut: "SIGN OUT",
    signingOut: "SIGNING OUT..."
  },
  sidebar: {
    title: "PORTAL",
    switchWorkspace: "Switch Workspace"
  },
  dashboard: {
    welcomeTitle: "Welcome to your Workspace",
    welcomeSubtitle: "This is dope. Let's get building.",
    messages: {
      welcome: {
        id: 'msg-1',
        sender: "Courtney",
        time: "Just now",
        body: "Hey, I am so pumped you're here. I'm still getting the final pieces put together behind the scenes, so if a button looks weird or something doesn't load right, just let me know. You can drop a note in the Support tab, or just text me if you have my number. Poke around your Live Storefront, add some photos, and let's get this going!"
      },
      returning: {
        id: 'msg-2',
        sender: "Courtney",
        time: "Just now",
        body: "Hey, nothing new today! Just wanted to say hi and see how it's going. Hope you're having a great day. Let me know if you need anything!"
      }
    }
  },
  // 🚀 NEW: Global Help Guide
  helpGuide: {
    title: "Quick Start Guide",
    subtitle: "Workspace Navigation",
    intro: "Pardon the digital dust while we get the engines running! Here is a quick breakdown of how to navigate your command center:",
    sections: [
      {
        id: "storefront",
        title: "Live Storefront",
        desc: "Your portal to edit copy and media. The live editor is locked by default to prevent accidental breaks. Request the keys to temporarily unlock it, or shoot me a message."
      },
      {
        id: "vault",
        title: "Media Vault",
        desc: "Drop high-res files, brand assets, and documents directly into this secure transfer vault so we have everything in one place."
      },
      {
        id: "support",
        title: "Support Desk",
        desc: "Got a question, found a glitch, or want to scope out a new feature? Drop it here. It acts as a direct, permanent pipeline to my inbox."
      },
      {
        id: "billing",
        title: "Billing & Plans",
        desc: "Manage your active subscription tier, safely update your payment methods, or download historical tax receipts."
      }
    ]
  },
  vault: {
    title: "Media Vault",
    subtitle: "Raw Assets & Documents",
    retentionNotice: "To keep our workspace optimized, raw files in this vault that are not actively attached to your live storefront are automatically purged after 30 days.",
    uploadBtn: "Upload Files",
    dragDrop: "Drag & Drop",
    emptyState: "No raw files in the vault."
  },
  storefront: {
    vibeCheckTitle: "Need a different vibe?",
    vibeCheckBody: "This command center gives you absolute control over your words and media. But if you want to restructure your layout, add brand new sections, or completely change the design aesthetic—just shoot me an email! I will custom-architect the code for you.",
    requestKeysBtn: "Request The Keys",
    keysRequested: "Keys Requested",
    keysPendingBody: "I've been pinged! I'll unlock your edit window shortly."
  },
  support: {
    title: "Help & Support",
    subtitle: "Direct line to Courtney. Let's get things sorted.",
    ticketTitle: "How can I help?",
    ticketBody: "Whether you need a quick fix, spotted a weird glitch, or want to brainstorm a massive new feature, drop it here and it goes straight to my inbox.",
    categories: [
      { id: 'question', label: 'Just a Question', description: 'General inquiries, minor content updates, or "how-to" help.' },
      { id: 'broken', label: 'Something Broke', description: 'Glitches, display errors, or something is malfunctioning.' },
      { id: 'idea', label: 'Big New Idea', description: 'Scope out a custom upgrade, new page, or structural shift.' }
    ],
    topics: [
      'Live Storefront',
      'Client Portal',
      'Billing & Subscription',
      'Custom Upgrade / Expansion',
      'Other'
    ],
    btnSend: "Send Message",
    btnSending: "Sending...",
    btnSent: "Message Sent!",
    expectTitle: "What to Expect",
    expectBody: "I usually review and reply to general questions within 24 hours. If we're mapping out a big upgrade or a custom build, we'll hash out a clear timeline together before diving in.",
    emergencyTitle: "Real Emergencies",
    emergencyBody: "If your website goes completely offline or something is seriously broken, flag it as 'Something Broke'. This bypasses the normal inbox and alerts me immediately so we can put out the fire fast.",
    historyTitle: "Message History",
    historyEmpty: "You haven't sent any messages yet."
  }
};