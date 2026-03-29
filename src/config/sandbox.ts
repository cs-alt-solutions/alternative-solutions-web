/* src/config/sandbox.ts */

export const SANDBOX_CLIENTS = {
  division: {
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
    
    // Delivery Minimums & Zones
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

    // ==========================================
    // THE MASTER INVENTORY DB (UPDATED STRUCTURE)
    // ==========================================
    inventory: [
      // --- MERCH & EXTRAS ---
      { 
        id: 'merch-1', name: 'Doobie Division Deal Bag', onHand: 100, category: 'Merch & Extras', 
        description: 'Choose a size and our team will craft a mystery bag based on your previous orders! The bigger the bag, the bigger the deals!', iconName: 'Box',
        sizes: [ { id: 'sz-sm', label: 'Small Bag', price: 100.00 }, { id: 'sz-md', label: 'Medium Bag', price: 200.00 }, { id: 'sz-lg', label: 'Large Bag', price: 300.00 } ],
        options: [ { id: 'opt-std', label: 'Standard Mix' } ]
      },
      { 
        id: 'merch-2', name: 'Division Air Fresheners', onHand: 50, category: 'Merch & Extras', 
        description: 'Rep the Team on the Go! Coffee Scented. ONLY $5 if spending $100+!', iconName: 'Leaf',
        sizes: [ { id: 'sz-std', label: 'Single', price: 10.00 } ],
        options: [ { id: 'opt-cof', label: 'Coffee' } ]
      },
      { 
        id: 'merch-3', name: 'Division Rolling Trays', onHand: 25, category: 'Merch & Extras', 
        description: 'Approx. 6in × 4in Limited Edition Batch Metal Tray.', iconName: 'Box',
        sizes: [ { id: 'sz-std', label: 'Single Tray', price: 20.00 } ],
        options: [ { id: 'opt-std', label: 'Standard Design' } ]
      },
      { 
        id: 'merch-4', name: 'Division Lighter & SnapBack', onHand: 40, category: 'Merch & Extras', 
        description: 'Black with Team Logo. Rep the Doobie Division.', iconName: 'Flame',
        sizes: [ { id: 'sz-lgt', label: 'Lighter', price: 5.00 }, { id: 'sz-hat', label: 'SnapBack Hat', price: 30.00 } ],
        options: [ { id: 'opt-blk', label: 'Black' } ]
      },
      { 
        id: 'merch-5', name: 'Division Merch MegaPack', onHand: 20, category: 'Merch & Extras', 
        description: 'Combo = 1 of Each (Air Freshener, Tray, Lighter, Hat).', iconName: 'Box',
        sizes: [ { id: 'sz-std', label: 'MegaPack', price: 50.00 } ],
        options: [ { id: 'opt-std', label: 'Standard Mix' } ]
      },

      // --- FLOWER ---
      { 
        id: 'flw-1', name: 'Jungle Boys Flower', onHand: 40, category: 'Flower', 
        description: 'Pre-Packaged 8ths. Grown in Orange County, CA. Jungle Boys Exclusive Genetics.', iconName: 'Leaf',
        sizes: [ { id: 'sz-35g', label: '3.5g (Eighth)', price: 50.00 } ],
        options: [ { id: 'opt-at', label: 'Animal Tsunami' }, { id: 'opt-rs', label: 'RS-1000' } ]
      },
      { 
        id: 'flw-2', name: 'Original Moonrocks', onHand: 60, category: 'Flower', 
        description: 'Premium Indoor Flower Dipped in Hash Oil & Rolled in Premium Indoor Kief.', iconName: 'Leaf',
        featured: true, 
        sizes: [ { id: 'sz-35g', label: '3.5g (Eighth)', price: 45.00 }, { id: 'sz-7g', label: '7g (Quarter)', price: 75.00 } ],
        options: [ 
          { id: 'opt-ga', label: 'Green Apple' }, { id: 'opt-gr', label: 'Gruntz' }, 
          { id: 'opt-gu', label: 'Gushers' }, { id: 'opt-op', label: 'Orange Push Pop' },
          { id: 'opt-sc', label: 'Sugar Cone' }, { id: 'opt-st', label: 'Sweet Tarts' }
        ]
      },

      // --- ROLLS ---
      { 
        id: 'rls-1', name: 'Sherbinski x Doja Prerolls', onHand: 50, category: 'Rolls', 
        description: 'Infused w/ Live Rosin. Ceramic Filter Tip. 5 Joints per Pack. Exclusive Collab!', iconName: 'Flame',
        sizes: [ { id: 'sz-pk', label: '5-Pack', price: 50.00 } ],
        options: [ 
          { id: 'opt-bis', label: 'Biscotti (Indica)' }, { id: 'opt-g41', label: 'G41 (Hybrid)' },
          { id: 'opt-gel', label: 'Gelonade (Sativa)' }, { id: 'opt-gus', label: 'Gushers (Indica)' }
        ]
      },
      { 
        id: 'rls-2', name: 'Sherbinski Rosin Prerolls', onHand: 50, category: 'Rolls', 
        description: 'Premium Sherbinski Flower. Live Rosin Infused. 0.5g Joints - 5 PER Pack. Reusable Ceramic Tips.', iconName: 'Flame',
        sizes: [ { id: 'sz-pk', label: '5-Pack', price: 50.00 } ],
        options: [ 
          { id: 'opt-az', label: 'Acai Z (Hybrid)' }, { id: 'opt-bac', label: 'Bacio (Hybrid)' },
          { id: 'opt-d31', label: 'D-31 (Indica)' }, { id: 'opt-sb', label: 'Snack Box (Sativa)' }
        ]
      },
      { 
        id: 'rls-3', name: 'Sweetz PreRolls', onHand: 80, category: 'Rolls', 
        description: 'Packs of 5 PreRolls. Infused and Rolled in Diamonds. Very Flavor Forward.', iconName: 'Flame',
        sizes: [ { id: 'sz-pk', label: '5-Pack', price: 40.00 } ],
        options: [ 
          { id: 'opt-bs', label: 'Black Sherbet' }, { id: 'opt-cc', label: 'Cotton Candy' },
          { id: 'opt-gj', label: 'Grape Jelly' }, { id: 'opt-4k', label: '4K Zkittlez' }
        ]
      },
      { 
        id: 'rls-4', name: 'Pleasures Hash Holes & Resin', onHand: 60, category: 'Rolls', 
        description: '1g Premium Indoor Flower + 0.2g Premium Extract. Glass Filter Tip.', iconName: 'Flame',
        sizes: [ { id: 'sz-ros', label: 'Rosin Hole', price: 40.00 }, { id: 'sz-res', label: 'Resin Hole', price: 30.00 } ],
        options: [ 
          { id: 'opt-wb', label: 'Watermelon Blast (Rosin)' }, { id: 'opt-pz', label: 'Purple Zoda (Rosin)' },
          { id: 'opt-bt', label: 'Boba Tea (Resin)' }, { id: 'opt-cb', label: 'Cherrie Berries (Resin)' }
        ]
      },
      { 
        id: 'rls-5', name: 'Tarantula PreRolls', onHand: 150, category: 'Rolls', 
        description: '1.5g Premium Indoor Flower. Infused with Live Resin. Rolled in Kief.', iconName: 'Flame',
        sizes: [ { id: 'sz-sgl', label: '1.5g Single', price: 20.00 } ],
        options: [ 
          { id: 'opt-abp', label: 'Atomic Bomb Pop' }, { id: 'opt-br', label: 'Blue Razz' },
          { id: 'opt-gr', label: 'Grape Runtz' }, { id: 'opt-sj', label: 'Strawberry Jam' }
        ]
      },

      // --- WAX & STUFF ---
      { 
        id: 'wax-1', name: 'Division Dabs - Crumble', onHand: 150, category: 'Wax & Stuff', 
        description: 'Live Resin Crumble Wax. Extracted Strain Specific Options! Terp Infused. Exclusive Division Item!', iconName: 'Box',
        sizes: [ { id: 'sz-3g', label: '3g Bucket', price: 25.00 }, { id: 'sz-5g', label: '5g Bucket', price: 40.00 }, { id: 'sz-10g', label: '10g Bucket', price: 75.00 } ],
        options: [ { id: 'opt-std', label: 'House Mix' } ] // Assuming generic for now, update as needed
      },
      { 
        id: 'wax-2', name: 'Division Dabs - Badder', onHand: 150, category: 'Wax & Stuff', 
        description: 'Live Resin Badder. Extracted Strain Specific Options! Terp Infused. Exclusive Division Item!', iconName: 'Box',
        sizes: [ { id: 'sz-3g', label: '3g Bucket', price: 25.00 }, { id: 'sz-5g', label: '5g Bucket', price: 40.00 }, { id: 'sz-10g', label: '10g Bucket', price: 75.00 } ],
        options: [ { id: 'opt-std', label: 'House Mix' } ] // Assuming generic for now
      },
      { 
        id: 'wax-3', name: 'Waxx Exotics (Soda Edition)', onHand: 30, category: 'Wax & Stuff', 
        description: 'Premium Sugar Diamonds. Ultra-Potent HTE. Exotic Soda-Inspired Flavors (All Hybrids).', iconName: 'Box',
        featured: true, 
        sizes: [ { id: 'sz-3g', label: '3g Bucket', price: 25.00 } ],
        options: [ 
          { id: 'opt-cc', label: 'Cactus Cooler' }, { id: 'opt-ff', label: 'Fresa Fresca' },
          { id: 'opt-ss', label: 'Sour Sandía' }, { id: 'opt-tp', label: 'Tiki Punch' }
        ]
      },
      { 
        id: 'wax-4', name: '710 Labs Persy Rosin', onHand: 10, category: 'Wax & Stuff', 
        description: 'Grown and Extracted in CA. The Best in the Game! 1g Luxury Rosin Badder/Sauce.', iconName: 'Box',
        sizes: [ { id: 'sz-1g', label: '1g Jar', price: 100.00 } ],
        options: [ { id: 'opt-710c', label: '710 Chem' }, { id: 'opt-sf', label: 'Super Freak' } ]
      },

      // --- PENS & KARTS ---
      { 
        id: 'pen-1', name: 'Raw Garden Disposable', onHand: 80, category: 'Pens', 
        description: '1g Disposable. Refined Live Resin. Made w/ NO Trim, NO Additives. 3 Heat Options.', iconName: 'Flame',
        sizes: [ { id: 'sz-1g', label: '1g Disposable', price: 50.00 } ],
        options: [ { id: 'opt-bg', label: 'Black Garlic' }, { id: 'opt-cc', label: 'Cherry Chem' }, { id: 'opt-fwt', label: 'Fresh Water Taffy' } ]
      },
      { 
        id: 'pen-2', name: 'Boutiq Switch (V5)', onHand: 40, category: 'Pens', 
        description: '2g Disposable, TRIPLE Tank System. Liquid Live Diamonds. Digital Screen Display.', iconName: 'Flame',
        sizes: [ { id: 'sz-2g', label: '2g Triple Tank', price: 50.00 } ],
        options: [ 
          { id: 'opt-pp', label: 'Purple Papaya x Blue Berriez x RZ-11' }, 
          { id: 'opt-af', label: 'Arctic Frost x Rocket Pop x Tropic Haze' }
        ]
      },
      { 
        id: 'pen-3', name: 'Packman V6 & MuhaMeds', onHand: 100, category: 'Pens', 
        description: 'High Potency 2g Disposables. Premium Cannabis Extract.', iconName: 'Flame',
        sizes: [ { id: 'sz-pm', label: 'Packman 2g', price: 40.00 }, { id: 'sz-mm', label: 'MuhaMeds 2g', price: 40.00 } ],
        options: [ 
          { id: 'opt-pm-bg', label: 'Berry Gelato (Packman)' }, { id: 'opt-pm-my', label: 'Miami Yayo (Packman)' },
          { id: 'opt-mm-bs', label: 'Blue Slushie (MuhaMeds)' }, { id: 'opt-mm-gd', label: 'Galactic Diesel (MuhaMeds)' }
        ]
      },
      { 
        id: 'kar-1', name: 'Flavorade Carts', onHand: 60, category: 'Karts', 
        description: 'Small Batch Artisan Cannabis Vape. Luxury Cold Cured Resin. 1g PER Cart!', iconName: 'Flame',
        sizes: [ { id: 'sz-1g', label: '1g Cart', price: 60.00 } ],
        options: [ 
          { id: 'opt-sm', label: 'Sin Mintz' }, { id: 'opt-rs', label: 'Rainbow Soap' },
          { id: 'opt-cl', label: 'Cherry Limeaid' }, { id: 'opt-jo', label: 'Jealousy OG' }
        ]
      },
      { 
        id: 'kar-2', name: 'Cold Fire Juice', onHand: 50, category: 'Karts', 
        description: 'Cured Resin Juice. Extracted BELOW -100°. NO Distillate, NO Additives.', iconName: 'Flame',
        sizes: [ { id: 'sz-1g', label: '1g Cart', price: 60.00 } ],
        options: [ { id: 'opt-ad', label: 'Angry Donuts' }, { id: 'opt-pr', label: 'Pop Rox' }, { id: 'opt-zt', label: 'Zoasty' } ]
      },

      // --- EDDY BULLS ---
      { 
        id: 'edb-1', name: 'MAD Bites & Bursts', onHand: 50, category: 'Eddy Bulls', 
        description: 'High Dose Edibles. Sour Belts and Nano Infused Gummies.', iconName: 'Box',
        sizes: [ { id: 'sz-mad', label: 'MAD Bites', price: 40.00 }, { id: 'sz-bur', label: 'Bursts (250mg)', price: 40.00 } ],
        options: [ 
          { id: 'opt-spl', label: 'Sour Pink Lemonade (MAD)' }, { id: 'opt-sr', label: 'Sour Rainbow (MAD)' },
          { id: 'opt-std', label: 'Standard (Bursts)' }
        ]
      },
      { 
        id: 'edb-2', name: 'Dope Ropes & Mambas', onHand: 100, category: 'Eddy Bulls', 
        description: 'Deliciously infused Ropes (200mg) and Mamba Gummies (200mg).', iconName: 'Box',
        sizes: [ { id: 'sz-dr', label: 'Dope Rope (200mg)', price: 20.00 }, { id: 'sz-mb', label: 'Mamba (200mg)', price: 30.00 } ],
        options: [ 
          { id: 'opt-cf', label: 'Cherry Fizz (Rope)' }, { id: 'opt-mm', label: 'Magic Mimosa (Rope)' },
          { id: 'opt-sa', label: 'Sour Apple (Mamba)' }, { id: 'opt-wm', label: 'Watermelon (Mamba)' }
        ]
      },
      { 
        id: 'edb-3', name: 'HIGH-Aid (Drink Mix)', onHand: 40, category: 'Eddy Bulls', 
        description: 'Classic Flavors. 500mg in Each Pack. Just Add Water!', iconName: 'Box',
        sizes: [ { id: 'sz-std', label: '500mg Pack', price: 25.00 } ],
        options: [ { id: 'opt-pg', label: 'Pink Guava' }, { id: 'opt-wg', label: 'Watermelon Gushers' } ]
      },

      // --- MRS. DOOB'S KITCHEN ---
      { 
        id: 'mrs-1', name: "Mrs. Doobie's CannaBudder", onHand: 20, category: "Mrs. Doob's Fun Food", 
        description: 'Make your OWN edibles! 1800mg THC PER Stick! Sweet Cream Butter.', iconName: 'Box',
        sizes: [ { id: 'sz-1stk', label: '1 Stick (8 Tbsp)', price: 50.00 } ],
        options: [ { id: 'opt-sc', label: 'Sweet Cream' } ]
      },
      { 
        id: 'mrs-2', name: "Mrs. Doobie's Munchie Melts", onHand: 30, category: "Mrs. Doob's Fun Food", 
        description: 'Infused Chocolate Bites. 80-85mg Per SQUARE! 12 Squares PER PACK! (1000mg TOTAL)', iconName: 'Box',
        sizes: [ { id: 'sz-12pk', label: '12-Pack', price: 30.00 } ],
        options: [ { id: 'opt-pbc', label: 'Peanut Butter Cup' }, { id: 'opt-cc', label: 'Cookies & Cream' }, { id: 'opt-sm', label: 'Smores' } ]
      },
      { 
        id: 'mrs-3', name: 'Stoned Smackers', onHand: 45, category: "Mrs. Doob's Fun Food", 
        description: 'Infused Uncrustables. Approx 250mg PER Sandwich. Smuckers Jam & Skippy PB.', iconName: 'Box',
        sizes: [ { id: 'sz-1pk', label: 'Single', price: 15.00 }, { id: 'sz-2pk', label: '2-Pack Deal', price: 25.00 } ],
        options: [ { id: 'opt-gr', label: 'Grape' }, { id: 'opt-st', label: 'Strawberry' } ]
      },
      { 
        id: 'mrs-4', name: 'Baked Goods & Fudge', onHand: 40, category: "Mrs. Doob's Fun Food", 
        description: 'High Slice Cheesecake (300mg), Fudge (300mg), Pie Bars (150mg) and Bangin Brownies (600mg).', iconName: 'Box',
        sizes: [ 
          { id: 'sz-tmc', label: 'Thin Mint Cheesecake', price: 20.00 }, { id: 'sz-cpb', label: 'Cherry Pie Bar', price: 10.00 },
          { id: 'sz-sf', label: 'Samoa Fudge (1x)', price: 15.00 }, { id: 'sz-llb', label: 'Lunchlady Brownie', price: 25.00 }
        ],
        options: [ { id: 'opt-std', label: 'Standard' } ] // Baked into size for now
      },

      // --- DRINKS ---
      { 
        id: 'drk-1', name: 'Medicated Mixers', onHand: 25, category: "Mrs. Doob's Drinks", 
        description: '8oz Bottles. Zing Zang Brand Mixers. 100mg THC Infused. ADD-ON ITEM!', iconName: 'Box',
        sizes: [ { id: 'sz-8oz', label: '8oz Bottle', price: 5.00 } ],
        options: [ { id: 'opt-bm', label: 'Bloody Mary' }, { id: 'opt-mm', label: 'Margarita Mix' }, { id: 'opt-pc', label: 'Pina Colada' } ]
      },
      { 
        id: 'drk-2', name: 'Juices & Teas', onHand: 40, category: "Mrs. Doob's Drinks", 
        description: '100mg Infused Drinks. Sunny-D, Paradise Punch, Sweet TeaHC, and Yoo-High. ADD-ON ITEMS!', iconName: 'Box',
        sizes: [ { id: 'sz-std', label: 'Single Drink', price: 5.00 } ],
        options: [ 
          { id: 'opt-sd', label: 'Sunny-D' }, { id: 'opt-ppb', label: 'Paradise Punch: Berry Blue' },
          { id: 'opt-stc', label: 'Sweet TeaHC' }, { id: 'opt-yhc', label: 'Yoo-High Chocolate' }
        ]
      },
      { 
        id: 'drk-3', name: 'Red’s Rosin Refreshers', onHand: 20, category: "Mrs. Doob's Drinks", 
        description: '250-300mg PER DRINK! Infused w/ Red’s Rosin! (45-159u). ADD-ON ITEM!', iconName: 'Box',
        sizes: [ { id: 'sz-1x', label: 'Single', price: 10.00 }, { id: 'sz-3x', label: 'Pick 3 Deal', price: 25.00 } ],
        options: [ { id: 'opt-cg', label: 'Cranberry Grape' } ]
      },

      // --- HEALTHCARE ---
      { 
        id: 'hc-1', name: 'Alleviate Pain Relief Salve', onHand: 15, category: 'Healthcare', 
        description: '100mg Hemp CBD / 100mg THC Infused Sunflower Oil. 100% Organic Beeswax Base.', iconName: 'Leaf',
        sizes: [ { id: 'sz-1oz', label: 'Single 1oz Jar', price: 20.00 }, { id: 'sz-2oz', label: '2-Jar Deal', price: 30.00 } ],
        options: [ { id: 'opt-std', label: 'Standard' } ]
      },
      { 
        id: 'hc-2', name: 'Canna-Sugar Scrubs', onHand: 20, category: 'Healthcare', 
        description: 'Cold-Pressed Cannabis Oil. Fine Sugar Crystals. 100% Vegan Friendly!', iconName: 'Box',
        sizes: [ { id: 'sz-bs', label: 'Body Scrub (4oz)', price: 30.00 }, { id: 'sz-ls', label: 'Lip Scrub (5g)', price: 10.00 } ],
        options: [ { id: 'opt-std', label: 'Standard' } ]
      },
      { 
        id: 'hc-3', name: 'HighDrated Lip Care', onHand: 15, category: 'Healthcare', 
        description: 'All Natural/Organic Ingredients. Made w/ Cold Pressed CannabisOil.', iconName: 'Box',
        sizes: [ { id: 'sz-lb', label: 'Lip Balm (5g Jar)', price: 25.00 }, { id: 'sz-lk', label: 'Lip Kit (Oil + Balm)', price: 40.00 } ],
        options: [ { id: 'opt-std', label: 'Standard' } ]
      }
    ],
    fulfillment: {
      initialOrders: [
        { id: "ORD-8821", customer: "Josh (Direct Access)", zone: "Williamsburg", status: 'pending', assignedTo: null, items: [{ id: 'flw-1', name: 'Jungle Boys Flower', qtyRequired: 1, qtyPicked: 0 }] },
        { id: "ORD-8822", customer: "Sarah J.", zone: "Virginia Beach", status: 'picking', assignedTo: 'Jason', items: [{ id: 'rls-2', name: 'Sherbinski Rosin Prerolls', qtyRequired: 3, qtyPicked: 1 }] }
      ]
    },
    logistics: {
      vendors: ["Sam's Club", "Walmart", "Restaurant Depot", "Amazon", "Local Supplier"],
      locations: {
        office: { id: 'loc-office', name: "Office", iconName: 'Briefcase', themeKey: 'emerald' },
        bakery: { id: 'loc-bakery', name: "Bakery", iconName: 'Coffee', themeKey: 'fuchsia' },
        store: { id: 'loc-store', name: "Country Store", iconName: 'Store', themeKey: 'blue' },
        restaurant: { id: 'loc-restaurant', name: "The Restaurant", iconName: 'Utensils', themeKey: 'amber' }
      },
      catalog: [
        { id: 'item-1', name: 'POM Paper Towels', unit: 'Bulk Pack', preferredVendor: "Sam's Club", locations: ['loc-store', 'loc-office'] },
        { id: 'item-sourdough', name: 'Pre-Sliced Sourdough', unit: 'Loaf', preferredVendor: "Walmart", locations: ['loc-bakery', 'loc-restaurant'] },
        { id: 'item-deli-cont', name: '8oz Clear Deli Containers', unit: '240ct Case', preferredVendor: "Restaurant Depot", locations: ['loc-bakery', 'loc-restaurant'] },
        { id: 'item-wings', name: 'Chicken Wings', unit: 'Bulk Case', preferredVendor: "Sam's Club", locations: ['loc-restaurant'] },
        { id: 'item-bacon', name: 'Hickory Bacon', unit: '5lb Pack', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
        { id: 'item-ranch', name: 'Ranch Dressing', unit: '1 Gallon Jug', preferredVendor: "Restaurant Depot", locations: ['loc-restaurant'] },
      ]
    }
  },
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