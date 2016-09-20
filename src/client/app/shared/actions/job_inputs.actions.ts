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
export class JobInputsActions {
  static REQUEST_JOBINPUTS  = '[JobInputs] Load job inputs';
  static RECEIVE_JOBINPUTS  = '[JobInputs] Load jobs inputs success';
  requestJobInputs(): Action {
    return {
      type: JobInputsActions.REQUEST_JOBINPUTS
    };
  }

  receiveJobInputs(jobInputs: Array<any>): Action {
    return {
      type: JobInputsActions.RECEIVE_JOBINPUTS,
      payload: jobInputs
    };
  }
}
