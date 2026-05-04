// src/config/clients/luckystrike/index.ts

export const luckystrikeConfig = {
  id: 'luckystrike',
  name: 'LuckyStrike Designs',
  agencyName: 'Alternative Solutions',
  primaryContact: 'Carmen & Jeremy',
  appTitle: 'LuckyStrike Portal',
  security: {
    pin: '1982', 
    lockedMessage: 'Enter access code to view the Virtual Garage prototype.',
  },
  apps: [
    {
      id: 'garage', 
      category: 'prototype',
      name: 'Virtual Garage',
      description: 'Immersive digital storefront and interactive shop map prototype.',
      icon: 'Wrench',
      status: 'beta',
      lastUpdated: 'Just now',
      updateLog: 'Garage Prototype Deployed'
    },
    {
      id: 'asset-hub',
      category: 'resource',
      name: 'Asset Terminal',
      description: 'Secure drop-zone for high-res build photography and vector logos.',
      icon: 'PackageSearch',
      status: 'live',
      lastUpdated: 'Today',
      updateLog: 'System Online'
    }
  ]
};