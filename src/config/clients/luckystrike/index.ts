// src/config/clients/luckystrike/index.ts

export const luckystrikeConfig = {
  id: 'luckystrike',
  name: 'LuckyStrike Designs',
  agencyName: 'Alternative Solutions',
  primaryContact: 'Carmen & Jeremy',
  appTitle: 'LuckyStrike Portal',
  security: {
    pin: '7777', // The access pin you'll give them
    lockedMessage: 'Enter access code to view the Virtual Garage prototype.',
  },
  apps: [
    {
      id: 'garage', // This matches the ID we set up in the page.tsx router!
      name: 'Virtual Garage',
      description: 'Immersive digital storefront and interactive shop map prototype.',
      icon: 'Wrench',
      status: 'beta',
      lastUpdated: 'Just now',
      updateLog: 'Garage Prototype Deployed'
    },
    {
      id: 'asset-hub',
      name: 'Asset Terminal',
      description: 'Secure drop-zone for high-res build photography and vector logos.',
      icon: 'PackageSearch',
      status: 'live',
      lastUpdated: 'Today',
      updateLog: 'System Online'
    }
  ]
};