import { divisionInventory } from './inventory';

export const divisionConfig = {
  id: 'division',
  accessCode: 'DIVISION',
  agencyName: "The Division",
  appTitle: "The Division",
  security: { 
    pin: "2026", 
    lockedMessage: "Secure Client & Staff Access",
    customerCodes: { morning: "WAKE", evening: "BAKE" }
  },
  primaryContact: "Doobie",
  
  deliveryZones: [
    { id: 'z-wbg', name: 'Williamsburg Areas', minimum: 50 },
    { id: 'z-gloy', name: 'Gloucester / Hayes / Yorktown', minimum: 75 },
    { id: 'z-nn', name: 'Newport News / Hampton', minimum: 75 },
    { id: 'z-qcc', name: 'Quinton / Charles City Areas', minimum: 75 },
    { id: 'z-wp', name: 'West Point / Saluda Area', minimum: 75 },
    { id: 'z-rich', name: 'Richmond & Surrounding Areas', minimum: 100 },
    { id: 'z-south', name: 'Southside Areas', minimum: 100 },
    { id: 'z-ash', name: 'Ashland & Surrounding Areas', minimum: 150 },
    { id: 'z-suf', name: 'Suffolk', minimum: 150 },
    { id: 'z-other', name: 'Other (Contact Us)', minimum: 0 }
  ],

  storePolicies: [
    "Orders go out at 5:30pm DAILY! Get your order in before 5pm for SAME DAY delivery.",
    "Friday & Saturday early run: Get orders in BEFORE 12PM (Drivers Leave at 12:30pm).",
    "Drivers are allowed a 10 MINUTE GRACE PERIOD upon arrival. If wait exceeds 10min, they must move on.",
    "If you cancel AFTER the order leaves the shop, future orders will be CashApp Pre-Pay only.",
    "ALL CashApp transactions require a $10 Convenience Fee."
  ],

  apps: [
    { id: 'storefront', name: "Division Market", description: "Customer Order Portal", iconName: "ShoppingCart", themeKey: "emerald" },
    { id: 'admin', name: "Admin Command", description: "Global Zone Health & Velocity", iconName: "Activity", themeKey: "emerald" },
    { id: 'logistics', name: "Core Logistics", description: "Procurement & Internal Routing", iconName: "Truck", themeKey: "cyan" },
    { id: 'fulfillment', name: "Order Fulfillment", description: "Live Order Picking & Dispatch", iconName: "PackageSearch", themeKey: "fuchsia" }
  ],

  // Automatically load the isolated inventory array
  inventory: divisionInventory,

  fulfillment: {
    initialOrders: []
  },
  logistics: { vendors: [], locations: {}, catalog: [] }
};