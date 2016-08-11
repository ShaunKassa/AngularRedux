import { provideRouter, RouterConfig } from '@angular/router';

import { JobsRoutes } from './+jobs/index';
import { PresetsRoutes } from './+presets/index';

const routes: RouterConfig = [
  ...JobsRoutes,
  ...PresetsRoutes
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes),
];
