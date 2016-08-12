import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { Config, NavbarComponent, REQUEST_JOBS} from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'aethic-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent]
})
export class AppComponent {
  constructor(private _store: Store<any>) {
    this._store.dispatch({type: REQUEST_JOBS});
    console.log('Environment config', Config);
  }
}
