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
  storefront: {
    // Merged the Vibe Check and Locked states into one friendly flow!
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