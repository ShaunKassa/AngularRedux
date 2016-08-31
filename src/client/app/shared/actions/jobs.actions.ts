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

  static LOAD_GROUPJOBS = '[GroupJobs] Load group jobs';
  loadGroupJobs(group: any, batch = 0): Action {
      return {
          type: JobsActions.LOAD_GROUPJOBS,
          payload: {
              group: group,
              batch: batch
          }
      };
  }

  static LOAD_GROUPJOBS_SUCCESS = '[GroupJobs] Load group jobs success';
  loadGroupJobsSuccess(payload: any): Action {
      return {
          type: JobsActions.LOAD_GROUPJOBS_SUCCESS,
          payload: payload
      };
  }
  

  static SAVE_JOB = '[Job] Save a job';
  saveJob(job: any): Action {
      return {
          type: JobsActions.SAVE_JOB,
          payload: job
      }
  }

  static SAVE_JOB_SUCCESS = '[Job] Save job success';
  saveJobSuccess(): Action {
      return {
          type: JobsActions.SAVE_JOB_SUCCESS
      }
  }

  static SAVE_JOB_FAILURE = '[Job] Save job failure';
  saveJobFailure(): Action {
      return {
          type: JobsActions.SAVE_JOB_FAILURE
      }
  }
}
