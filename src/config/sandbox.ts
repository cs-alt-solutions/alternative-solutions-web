/* src/config/sandbox.ts */

// Import the modularized client configs
import { divisionConfig } from './clients/division';

export const SANDBOX_CLIENTS = {
  // Inject The Division's entire payload cleanly
  division: divisionConfig,
  
  // Keep the smaller Automotive dummy client inline (or move to its own file later!)
  automotive: {
    id: 'automotive',
    accessCode: 'AUTO',
    agencyName: "Victory Automotive",
    appTitle: "Victory Parts & Service",
    security: { pin: "2026", lockedMessage: "Service Bay Terminal" },
    primaryContact: "Mike Foreman",
    apps: [
      { id: 'procurement', name: "Parts Procurement", description: "Daily Dealer Pickups", iconName: "Truck", themeKey: "cyan" },
      { id: 'fulfillment', name: "Service Bay Pull", description: "Pull Parts for Techs", iconName: "Wrench", themeKey: "amber" }
    ],
    logistics: {
      vendors: ["NAPA Auto Parts", "O'Reilly", "OEM Dealer"],
      locations: {
        bays: { id: 'loc-bays', name: "Service Bays", iconName: 'Wrench', themeKey: 'amber' }
      },
      catalog: [
        { id: 'pt-1', name: 'Synthetic 5W-30', unit: 'Quart', preferredVendor: "NAPA Auto Parts", locations: ['loc-bays'] },
        { id: 'pt-2', name: 'Ceramic Brake Pads', unit: 'Box', preferredVendor: "O'Reilly", locations: ['loc-bays'] },
      ]
    }
  }
};

export const MASTER_CATALOG = [
  { id: 'item-wings', name: 'Chicken Wings', unit: 'Bulk Case', category: 'Meat', preferredVendor: "Sam's Club", locations: ['loc-restaurant'] },
  { id: 'item-bacon', name: 'Hickory Bacon', unit: '5lb Pack', category: 'Meat', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
  { id: 'item-hoagie', name: '11" Hoagie Rolls', unit: '6-Pack Case', category: 'Bread', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] }
];