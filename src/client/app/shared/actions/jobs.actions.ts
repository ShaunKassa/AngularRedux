import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';


/**
 * Instead of passing around action string constants and manually recreating
 * action objects at the point of dispatch, we create services encapsulating
 * each appropriate action group. Action types are included as static
 * members and kept next to their action creator. This promotes a
 * uniform interface and single import for appropriate actions
 * within your application components.
 */
@Injectable()
export class JobsActions {
  static REQUEST_JOBS  = '[Jobs] Load jobs';
  requestJobs(): Action {
    return {
      type: JobsActions.REQUEST_JOBS
    };
  }

  static RECEIVE_JOBS  = '[Jobs] Load jobs success';
  receiveJobs(jobs: Array<any>): Action {
    return {
      type: JobsActions.RECEIVE_JOBS,
      payload: jobs
    };
  }
}
