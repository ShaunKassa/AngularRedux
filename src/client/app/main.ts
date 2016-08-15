import { APP_BASE_HREF } from '@angular/common';
import { PLATFORM_DIRECTIVES } from '@angular/core';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { disableDeprecatedForms, provideForms } from '@angular/forms';
import { provideStore, combineReducers } from '@ngrx/store';
import { runEffects } from '@ngrx/effects';
import { JobsEffects } from './shared/effects/index';
import { storeLogger } from 'ngrx-store-logger';
import { instrumentStore } from '@ngrx/store-devtools';
import { useLogMonitor } from '@ngrx/store-log-monitor';
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';

import { APP_ROUTER_PROVIDERS } from './app.routes';
import AppComponent from './app.component';
import reducer from './shared/reducers/index';
import effects from './shared/effects/index';
import services from './shared/services/index';
import actions from './shared/actions/index';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }

/**
 * Bootstraps the application and makes the ROUTER_PROVIDERS and the APP_BASE_HREF available to it.
 * @see https://angular.io/docs/ts/latest/api/platform-browser-dynamic/index/bootstrap-function.html
 */
bootstrap(AppComponent, [
  HTTP_PROVIDERS,
  provideStore(reducer),
  runEffects(effects),
  { provide: PLATFORM_DIRECTIVES, useValue: [ROUTER_DIRECTIVES], multi: true },
  instrumentStore({
      monitor: useLogMonitor({
          // Default log monitor options
          position: 'right',
          visible: true,
          size: 0.3
      })
  }),
  services,
  actions,
  disableDeprecatedForms(),
  provideForms(),
  APP_ROUTER_PROVIDERS,
  {
    provide: APP_BASE_HREF,
    useValue: '<%= APP_BASE %>'
  }
]);

// In order to start the Service Worker located at "./worker.js"
// uncomment this line. More about Service Workers here
// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
//
// if ('serviceWorker' in navigator) {
//   (<any>navigator).serviceWorker.register('./worker.js').then((registration: any) =>
//       console.log('ServiceWorker registration successful with scope: ', registration.scope))
//     .catch((err: any) =>
//       console.log('ServiceWorker registration failed: ', err));
// }
