/* src/config/dashboard/editor/index.ts */
export {
  THEME_FAMILIES,
  BRAND_COLORS,
  ALL_HEROS,
  ALL_CONTENTS,
  ALL_ABOUTS,
  THEME_CONSTRAINTS,
  VISUAL_ARCH_COPY,
} from './themes';

export { INDUSTRY_BLUEPRINTS, getActiveBlueprint } from './blueprints';
export type { IndustryBlueprint } from './blueprints';

import { CANVAS_COPY, CORE_TAB_COPY, CONTENT_TAB_COPY } from './contentCopy';
import { SERVICES_TAB_COPY, LOGISTICS_TAB_COPY } from './operationsCopy';
import { COMMAND_HUB_COPY, GRID_TAB_COPY } from './managementCopy';

export const EDITOR_WORKSPACE_COPY = {
  CANVAS: CANVAS_COPY,
  CORE_TAB: CORE_TAB_COPY,
  CONTENT_TAB: CONTENT_TAB_COPY,
  SERVICES_TAB: SERVICES_TAB_COPY,
  LOGISTICS_TAB: LOGISTICS_TAB_COPY,
  COMMAND_HUB: COMMAND_HUB_COPY,
  GRID_TAB: GRID_TAB_COPY,
};