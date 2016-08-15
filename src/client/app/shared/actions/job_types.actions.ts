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
export class JobTypesActions {
  static REQUEST_JOBTYPES  = '[JobTypes] Load job types';
  requestJobTypes(): Action {
    return {
      type: JobTypesActions.REQUEST_JOBTYPES
    };
  }

  static RECEIVE_JOBTYPES  = '[JobTypes] Load jobs types success';
  receiveJobTypes(jobTypes: Array<any>): Action {
    return {
      type: JobTypesActions.RECEIVE_JOBTYPES,
      payload: jobTypes
    };
  }
}
