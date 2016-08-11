import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';

import { Config, NameListService, NavbarComponent} from './shared/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'aethic-app',
  viewProviders: [NameListService, HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent]
})
export class AppComponent {
  constructor(private _store: Store<any>) {
    console.log('Environment config', Config);
  }
}
