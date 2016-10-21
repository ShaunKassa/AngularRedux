import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { JobsActions, JobTypesActions, JobInputsActions } from './shared/actions/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'aethic-app',
  templateUrl: 'app.component.html'
})
export default class AppComponent {
  constructor(private _store: Store<any>) {
    this._store.dispatch({type: JobTypesActions.REQUEST_JOBTYPES});
    this._store.dispatch({type: JobInputsActions.REQUEST_JOBINPUTS});
    this._store.dispatch({type: JobsActions.LOAD_JOBS, payload: { batch: 0 }});
  }
}
