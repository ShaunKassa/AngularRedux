import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { HTTP_PROVIDERS } from '@angular/http';
import { StoreLogMonitorComponent } from '@ngrx/store-log-monitor';

import { Config, NavbarComponent } from './shared/index';
import { JobsActions, JobTypesActions } from './shared/actions/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'aethic-app',
  viewProviders: [HTTP_PROVIDERS],
  templateUrl: 'app.component.html',
  directives: [ROUTER_DIRECTIVES, NavbarComponent, StoreLogMonitorComponent]
})
export default class AppComponent {
  constructor(private _store: Store<any>) {
    this._store.dispatch({type: JobsActions.REQUEST_JOBS});
    this._store.dispatch({type: JobTypesActions.REQUEST_JOBTYPES});
    console.log('Environment config', Config);
  }
}
