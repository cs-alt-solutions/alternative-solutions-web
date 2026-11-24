/* src/config/dashboard/editor/index.ts */
export {
  THEME_FAMILIES,
  BRAND_COLORS,
  MASTHEAD_FONTS,
  ALL_HEROS,
  ALL_CONTENTS,
  ALL_ABOUTS,
  THEME_CONSTRAINTS,
  VISUAL_ARCH_COPY,
} from './themes';

export { INDUSTRY_BLUEPRINTS, getActiveBlueprint } from './blueprints';
export type { IndustryBlueprint } from './blueprints';

export { WEEK_DAYS, RULE_TYPES, getLogisticsPresets } from './logistics';
export type { RuleType, ScheduleMode, Fee, OperationalTerm, PolicyPreset } from './logistics';

export { EVENT_CATEGORIES, EVENTS_TAB_COPY, getEventPresets } from './events';
export type { EventCategory, StorefrontEvent, EventPreset } from './events';

import { CANVAS_COPY, CORE_TAB_COPY, CONTENT_TAB_COPY } from './contentCopy';
import { SERVICES_TAB_COPY, LOGISTICS_TAB_COPY } from './operationsCopy';
import { COMMAND_HUB_COPY, GRID_TAB_COPY } from './managementCopy';
import { EVENTS_TAB_COPY } from './events';

export const EDITOR_WORKSPACE_COPY = {
  CANVAS: CANVAS_COPY,
  CORE_TAB: CORE_TAB_COPY,
  CONTENT_TAB: CONTENT_TAB_COPY,
  SERVICES_TAB: SERVICES_TAB_COPY,
  LOGISTICS_TAB: LOGISTICS_TAB_COPY,
  EVENTS_TAB: EVENTS_TAB_COPY,
  COMMAND_HUB: COMMAND_HUB_COPY,
  GRID_TAB: GRID_TAB_COPY,
};