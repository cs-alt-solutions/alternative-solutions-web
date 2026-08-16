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
  // 🚀 NEW: The Dashboard Quick Start Guide
  dashboard: {
    welcomeTitle: "Welcome to your Workspace",
    guideTitle: "Quick Start Guide",
    guideSubtitle: "Welcome to your command center",
    intro: "I am super pumped that we are finally here. Pardon the digital dust while we get the engines running! Here is a quick breakdown of how to navigate your new workspace:",
    steps: [
      {
        name: "Live Storefront",
        desc: "Your portal to edit copy and media. Note that to prevent accidental breaks, the live editor is locked by default. If you need to make structural changes, just request the keys to temporarily unlock it, or shoot me a message to handle it for you."
      },
      {
        name: "Support Desk",
        desc: "Got a question, found a glitch, or want to scope out a new feature? Drop it in the Support tab. It acts as a direct, permanent pipeline to my inbox so nothing gets lost in email threads."
      },
      {
        name: "Settings & Vault",
        desc: "Manage your core identity, update your brand logo, and drop high-res files directly into the secure transfer vault."
      }
    ],
    signOff: "— Courtney"
  },
  storefront: {
    lockedTitle: "Want to make an edit or change the vibe?",
    lockedBody: "I keep the live storefront locked by default so we don't accidentally break your layout. If you need to update text, swap out some images, or completely shift the visual aesthetic, just request the keys!",
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