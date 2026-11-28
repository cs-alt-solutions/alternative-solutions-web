/* src/config/dashboard/editor/logistics.ts */

export type RuleType = 'schedule' | 'travel' | 'booking' | 'rates' | 'notice' | 'faq';
export type ScheduleMode = 'active' | 'blackout';

export interface Fee {
  name: string;
  price: string;
}

export interface OperationalTerm {
  title: string;
  description: string;
  appliesTo?: string;
  type?: RuleType;
  badge?: string;
  days?: string[];
  scheduleMode?: ScheduleMode;
  scheduleWindow?: string;
  fees?: Fee[];
}

export const WEEK_DAYS = [
  { key: 'sun', short: 'S', label: 'Sun' },
  { key: 'mon', short: 'M', label: 'Mon' },
  { key: 'tue', short: 'T', label: 'Tue' },
  { key: 'wed', short: 'W', label: 'Wed' },
  { key: 'thu', short: 'T', label: 'Thu' },
  { key: 'fri', short: 'F', label: 'Fri' },
  { key: 'sat', short: 'S', label: 'Sat' },
] as const;

export const RULE_TYPES: { id: Exclude<RuleType, 'faq'>; label: string }[] = [
  { id: 'schedule', label: 'Schedule' },
  { id: 'travel', label: 'Travel' },
  { id: 'booking', label: 'Booking' },
  { id: 'rates', label: 'Rates' },
  { id: 'notice', label: 'Notice' },
];

export interface PolicyPreset {
  label: string;
  template: OperationalTerm;
}

const LOGISTICS_PRESETS: Record<string, PolicyPreset[]> = {
  Hub: [
    {
      label: 'Travel Schedule',
      template: {
        title: 'Travel & Drop-Off Schedule',
        description: '',
        appliesTo: 'ALL',
        type: 'schedule',
        badge: 'Sundays Only',
        days: ['sun'],
        scheduleMode: 'active',
        scheduleWindow: 'Drops & Pickups',
        fees: [],
      },
    },
    {
      label: 'Site / Trailer Access',
      template: {
        title: 'Site & Access Requirements',
        description: '',
        appliesTo: 'ALL',
        type: 'travel',
        badge: 'Required',
        fees: [],
      },
    },
    {
      label: 'Deposit & Weather',
      template: {
        title: 'Booking Deposit & Rescheduling',
        description: '',
        appliesTo: 'ALL',
        type: 'booking',
        badge: '50% Deposit',
        fees: [],
      },
    },
  ],
  Culinary: [
    {
      label: 'Serving Hours',
      template: {
        title: 'Serving Schedule',
        description: '',
        appliesTo: 'ALL',
        type: 'schedule',
        badge: 'Weekends',
        days: ['sat', 'sun'],
        scheduleMode: 'active',
        scheduleWindow: '9AM – 1PM',
        fees: [],
      },
    },
    {
      label: 'Dietary / Upcharges',
      template: {
        title: 'Dietary & Crust Modifiers',
        description: '',
        appliesTo: 'ALL',
        type: 'rates',
        badge: 'Optional',
        fees: [{ name: 'Gluten-Free Option', price: '+$3' }],
      },
    },
    {
      label: 'Kitchen Notice',
      template: {
        title: 'Allergy & Gratuity Notice',
        description: '',
        appliesTo: 'ALL',
        type: 'notice',
        badge: 'Parties 6+',
        fees: [],
      },
    },
  ],
  Creative: [
    {
      label: 'Shoot Days',
      template: {
        title: 'Booking Availability',
        description: '',
        appliesTo: 'ALL',
        type: 'schedule',
        badge: 'By Appointment',
        days: ['fri', 'sat', 'sun'],
        scheduleMode: 'active',
        scheduleWindow: 'Golden Hour / Custom',
        fees: [],
      },
    },
    {
      label: 'Travel Radius',
      template: {
        title: 'Travel & Mileage Policy',
        description: '',
        appliesTo: 'ALL',
        type: 'travel',
        badge: '40 Mi Free',
        fees: [{ name: 'Beyond 40 Miles', price: '$0.75/mi' }],
      },
    },
    {
      label: 'Retainer & Delivery',
      template: {
        title: 'Retainer & Turnaround',
        description: '',
        appliesTo: 'ALL',
        type: 'booking',
        badge: '30% Retainer',
        fees: [],
      },
    },
  ],
  DEFAULT: [
    {
      label: 'Service Hours',
      template: {
        title: 'Service Schedule',
        description: '',
        appliesTo: 'ALL',
        type: 'schedule',
        badge: 'Mon – Fri',
        days: ['mon', 'tue', 'wed', 'thu', 'fri'],
        scheduleMode: 'active',
        scheduleWindow: '8AM – 5PM',
        fees: [],
      },
    },
    {
      label: 'Travel / Dispatch',
      template: {
        title: 'Service Area & Dispatch',
        description: '',
        appliesTo: 'ALL',
        type: 'travel',
        badge: 'Local Area',
        fees: [],
      },
    },
    {
      label: 'Deposits & Terms',
      template: {
        title: 'Payment & Cancellation Terms',
        description: '',
        appliesTo: 'ALL',
        type: 'booking',
        badge: 'Standard',
        fees: [],
      },
    },
  ],
};

export function getLogisticsPresets(blueprintId: string): PolicyPreset[] {
  return LOGISTICS_PRESETS[blueprintId] || LOGISTICS_PRESETS.DEFAULT;
}