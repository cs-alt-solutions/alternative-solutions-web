/* src/config/dashboard/editor/blueprints.ts */

export interface IndustryBlueprint {
  id: string;
  label: string;
  tabLabel: string;
  sectionHeading: string;
  primaryToggleLabel: string;
  addonsToggleLabel: string;
  addPrimaryBtn: string;
  emptyPrimaryText: string;
  titlePlaceholder: string;
  pricePlaceholder: string;
  deliverablesLabel: string;
  deliverablePlaceholder: string;
  addDeliverableBtn: string;
  optionsLabel: string;
  optionPlaceholder: string;
  addOptionBtn: string;
  showOrderingUrl: boolean;
  defaultContentLayout: string;
  logisticsHeading: string;
  logisticsHelper: string;
  logisticsScopeLabel: string;
  logisticsRulePlaceholder: string;
  logisticsFeePlaceholder: string;
  logisticsPricePlaceholder: string;
  logisticsCaveatsPlaceholder: string;
}

export const INDUSTRY_BLUEPRINTS: Record<string, IndustryBlueprint> = {
  Culinary: {
    id: 'Culinary',
    label: 'Culinary & Hospitality',
    tabLabel: 'Menu',
    sectionHeading: 'Menu Categories',
    primaryToggleLabel: 'Categories',
    addonsToggleLabel: 'Upgrades',
    addPrimaryBtn: 'Add Category',
    emptyPrimaryText: 'No culinary categories defined.',
    titlePlaceholder: 'Category Name (e.g., Starters, Burgers)',
    pricePlaceholder: 'Availability (e.g., All Day)',
    deliverablesLabel: 'Included Varieties & Examples',
    deliverablePlaceholder: 'Variety or item example (e.g., Seasonal Scones, GF Muffins)...',
    addDeliverableBtn: 'Add Variety / Example',
    optionsLabel: 'Flavor, Dietary & Custom Inquiry Options',
    optionPlaceholder: 'Option (e.g., Gluten-Free, Vegan, Custom Preorder)',
    addOptionBtn: 'Add Dietary / Custom Option',
    showOrderingUrl: true,
    defaultContentLayout: 'menu',
    logisticsHeading: 'Menu Policies, Hours & Modifiers',
    logisticsHelper: 'Set storewide kitchen notes (allergies, auto-gratuity, catering lead times) or attach serving hours and crust/side upcharges to a specific menu category.',
    logisticsScopeLabel: 'Applies To Category',
    logisticsRulePlaceholder: 'e.g., Brunch Hours, Gluten-Free Options, or Party Gratuity',
    logisticsFeePlaceholder: 'e.g., Gluten-Free Crust or Auto-Gratuity (6+)',
    logisticsPricePlaceholder: '+$3 / 18%',
    logisticsCaveatsPlaceholder: 'e.g., Served Sat–Sun 9AM–1PM only, or consuming raw/undercooked meats may increase risk...',
  },
  Creative: {
    id: 'Creative',
    label: 'Creative & Media',
    tabLabel: 'Portfolio',
    sectionHeading: 'Packages & Collections',
    primaryToggleLabel: 'Packages',
    addonsToggleLabel: 'Add-ons',
    addPrimaryBtn: 'Add Package',
    emptyPrimaryText: 'No creative packages defined.',
    titlePlaceholder: 'Package Name (e.g., Commercial Shoot, Wedding Collection)',
    pricePlaceholder: 'Starting Price (e.g., $1,500)',
    deliverablesLabel: 'Package Deliverables',
    deliverablePlaceholder: 'Deliverable (e.g., 2.5 Hours, 30 Edited Photos)...',
    addDeliverableBtn: 'Add Deliverable',
    optionsLabel: 'Inquiry Options & Upgrades',
    optionPlaceholder: 'Option (e.g., Second Shooter, Rush Delivery)',
    addOptionBtn: 'Add Inquiry Option',
    showOrderingUrl: false,
    defaultContentLayout: 'lookbook',
    logisticsHeading: 'Booking Terms, Travel & Turnaround',
    logisticsHelper: 'Configure retainers, travel mileage, image licensing, or attach package-specific add-on rates.',
    logisticsScopeLabel: 'Applies To Package',
    logisticsRulePlaceholder: 'e.g., Travel Radius, Retainer Policy, or Rush Delivery',
    logisticsFeePlaceholder: 'e.g., Outside 40 Miles or 48-Hr Rush Edit',
    logisticsPricePlaceholder: '$0.75/mi',
    logisticsCaveatsPlaceholder: 'e.g., A 30% non-refundable retainer secures your date. Full gallery delivered within 14 days...',
  },
  DEFAULT: {
    id: 'General',
    label: 'General / Services',
    tabLabel: 'Services',
    sectionHeading: 'Services & Packages',
    primaryToggleLabel: 'Services',
    addonsToggleLabel: 'Upgrades',
    addPrimaryBtn: 'Add Service',
    emptyPrimaryText: 'No core services or packages defined.',
    titlePlaceholder: 'Service / Package Name',
    pricePlaceholder: 'Price / Rate (Optional)',
    deliverablesLabel: 'Service Scope & Deliverables',
    deliverablePlaceholder: 'Scope item or deliverable...',
    addDeliverableBtn: 'Add Scope Item',
    optionsLabel: 'Inquiry Options & Selections',
    optionPlaceholder: 'Option (e.g., Emergency Service, Extended Warranty)',
    addOptionBtn: 'Add Inquiry Option',
    showOrderingUrl: false,
    defaultContentLayout: 'classic',
    logisticsHeading: 'Service Policies & Rate Tiers',
    logisticsHelper: 'Configure service-area minimums, emergency rates, deposits, and warranty terms—either storewide or tied to a specific service.',
    logisticsScopeLabel: 'Applies To Service',
    logisticsRulePlaceholder: 'e.g., Service Call Minimum, Travel Radius, or Warranty',
    logisticsFeePlaceholder: 'e.g., Diagnostic Fee or After-Hours Dispatch',
    logisticsPricePlaceholder: '$95',
    logisticsCaveatsPlaceholder: 'e.g., Service call fee is waived when work is approved. Licensed & insured...',
  },
  HUB_OVERRIDE: {
    id: 'Hub',
    label: 'Multi-Department Hub',
    tabLabel: 'Departments',
    sectionHeading: 'Storefront Departments',
    primaryToggleLabel: 'Departments',
    addonsToggleLabel: 'Upgrades',
    addPrimaryBtn: 'Add Department',
    emptyPrimaryText: 'No departments defined yet.',
    titlePlaceholder: 'Department Name (e.g., Custom Cakes, Goat Brush Clearing)',
    pricePlaceholder: 'Starting Price / Tag (Optional)',
    deliverablesLabel: 'Department Highlights & Offerings',
    deliverablePlaceholder: 'Highlight or offering...',
    addDeliverableBtn: 'Add Highlight',
    optionsLabel: 'Department Inquiry Options',
    optionPlaceholder: 'Specific inquiry topic for this department...',
    addOptionBtn: 'Add Department Option',
    showOrderingUrl: false,
    defaultContentLayout: 'hub',
    logisticsHeading: 'Department Policies & Rates',
    logisticsHelper: 'Attach booking requirements, travel fees, or prep rules to a specific department—or keep them Storewide to display across every department.',
    logisticsScopeLabel: 'Applies To Department',
    logisticsRulePlaceholder: 'e.g., Trailer Access, Weather Rescheduling, or Mileage Fees',
    logisticsFeePlaceholder: 'e.g., Travel Over 30 Miles or Temporary Fencing',
    logisticsPricePlaceholder: '$150',
    logisticsCaveatsPlaceholder: 'e.g., Requires flat trailer parking and clear yard access. 50% deposit due at booking...',
  },
};

export function getActiveBlueprint(industryTag?: string, engineMode?: string): IndustryBlueprint {
  if (engineMode === 'hub') return INDUSTRY_BLUEPRINTS.HUB_OVERRIDE;
  if (industryTag && INDUSTRY_BLUEPRINTS[industryTag]) return INDUSTRY_BLUEPRINTS[industryTag];
  return INDUSTRY_BLUEPRINTS.DEFAULT;
}