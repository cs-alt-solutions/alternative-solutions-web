/* src/config/dashboard/editor/events.ts */

export type EventCategory =
  | 'festival'
  | 'appearance'
  | 'popup'
  | 'truck'
  | 'session'
  | 'live'
  | 'special';

export interface StorefrontEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  location?: string;
  address?: string;
  category?: EventCategory;
  description?: string;
  imageUrl?: string;
  linkUrl?: string;
  isFeatured?: boolean;
  isVisible?: boolean;
}

export const EVENT_CATEGORIES: { id: EventCategory; label: string }[] = [
  { id: 'festival', label: 'Farm / Festival' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'popup', label: 'Pop-Up Market' },
  { id: 'truck', label: 'Food Truck Stop' },
  { id: 'session', label: 'Mini-Sessions' },
  { id: 'live', label: 'Live Night' },
  { id: 'special', label: 'Special Event' },
];

export const EVENTS_TAB_COPY = {
  HEADING: 'Upcoming Events',
  ADD_BTN: 'Add Event',
  HELPER_TEXT: 'Post festivals, pop-ups, food truck stops, or mini-sessions. Past dates auto-hide on the live storefront.',
  QUICK_ADD_LABEL: 'Quick Add:',
  EMPTY_STATE: 'No upcoming events scheduled (section stays hidden).',
  UNTITLED_EVENT: 'Untitled Event',
  BADGE_LIVE_SUFFIX: 'Live',
  BADGE_PAST_SUFFIX: 'Past',
  BADGE_HIDDEN: 'Hidden',
  DATE_LABEL: 'Date',
  CATEGORY_LABEL: 'Category Tag',
  TITLE_PLACEHOLDER: 'Event Title (e.g., Holiday Farm Day with Nico)',
  START_TIME_PLACEHOLDER: 'Start (e.g., 10:00 AM)',
  END_TIME_PLACEHOLDER: 'End (e.g., 4:00 PM)',
  LOCATION_PLACEHOLDER: 'Venue / Spot (e.g., Hobbsville Farmers Market)',
  ADDRESS_PLACEHOLDER: 'Street Address or City/State (for 1-tap Google Maps)',
  DESC_PLACEHOLDER: 'Short hype note (e.g., Free photos with Nico, fresh cuts available, rain or shine!)',
  LINK_PLACEHOLDER: 'Optional Ticket / Facebook Event URL',
  LINK_HELPER: 'Leave blank to turn the button into an interactive RSVP / Ask About Event form.',
  VAULT_NONE_OPTION: 'No thumbnail photo (Clean date stub)',
  VAULT_PREFIX: 'Vault:',
  SPOTLIGHT_BTN: 'Spotlight',
  VISIBLE_BTN: 'Visible',
  HIDDEN_BTN: 'Hidden',
  DELETE_TITLE: 'Delete Event',
};

export interface EventPreset {
  label: string;
  template: Omit<StorefrontEvent, 'id'>;
}

const EVENT_PRESETS: Record<string, EventPreset[]> = {
  Hub: [
    {
      label: 'Farm Festival',
      template: {
        title: 'Community Farm Festival',
        date: '',
        startTime: '10:00 AM',
        endTime: '4:00 PM',
        location: '',
        category: 'festival',
        description: 'Come meet the animals, take photos with Nico, and check out local farm goods.',
        isVisible: true,
      },
    },
    {
      label: 'Live Appearance',
      template: {
        title: 'Special Appearance',
        date: '',
        startTime: '11:00 AM',
        endTime: '2:00 PM',
        location: '',
        category: 'appearance',
        description: 'Stop by in person for photo ops and Q&A.',
        isVisible: true,
      },
    },
  ],
  Culinary: [
    {
      label: 'Pop-Up Market',
      template: {
        title: 'Weekend Pop-Up Market',
        date: '',
        startTime: '9:00 AM',
        endTime: '1:00 PM',
        location: '',
        category: 'popup',
        description: 'Fresh batch drop—come early before items sell out!',
        isVisible: true,
      },
    },
    {
      label: 'Food Truck Stop',
      template: {
        title: 'Food Truck Service',
        date: '',
        startTime: '11:30 AM',
        endTime: '7:00 PM',
        location: '',
        category: 'truck',
        description: 'Serving the full hot menu on-site.',
        isVisible: true,
      },
    },
  ],
  Creative: [
    {
      label: 'Mini-Sessions',
      template: {
        title: 'Seasonal Mini-Sessions',
        date: '',
        startTime: '2:00 PM',
        endTime: '6:00 PM',
        location: '',
        category: 'session',
        description: 'Limited back-to-back 20-minute portrait slots available.',
        isVisible: true,
      },
    },
  ],
  DEFAULT: [
    {
      label: 'Pop-Up / Market',
      template: {
        title: 'Local Pop-Up Event',
        date: '',
        startTime: '10:00 AM',
        endTime: '3:00 PM',
        location: '',
        category: 'popup',
        description: '',
        isVisible: true,
      },
    },
    {
      label: 'Special Event',
      template: {
        title: 'Upcoming Community Event',
        date: '',
        startTime: '12:00 PM',
        endTime: '4:00 PM',
        location: '',
        category: 'special',
        description: '',
        isVisible: true,
      },
    },
  ],
};

export function getEventPresets(blueprintId: string): EventPreset[] {
  return EVENT_PRESETS[blueprintId] || EVENT_PRESETS.DEFAULT;
}