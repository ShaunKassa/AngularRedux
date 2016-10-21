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

  static LOAD_JOBS = '[Jobs] Load jobs';
  static LOAD_JOBS_SUCCESS = '[Jobs] Load jobs success';
  static SEARCH_JOBS = '[Jobs] Search jobs';
  static SEARCH_COMPLETE_JOBS = '[Jobs] Search jobs complete';
  static LOAD_GROUPJOBS = '[GroupJobs] Load group jobs';
  static LOAD_GROUPJOBS_SUCCESS = '[GroupJobs] Load group jobs success';
  static RECEIVE_JOBS  = '[Jobs] Load jobs success';
  static SAVE_JOB = '[Job] Save a job';
  static SAVE_JOB_FAILURE = '[Job] Save job failure';
  static SAVE_JOB_SUCCESS = '[Job] Save job success';

  loadJobs(batch = 0): Action {
      return {
          type: JobsActions.LOAD_JOBS,
          payload: {
              batch: batch
          }
      };
  }

  loadJobsSuccess(payload: any): Action {
      return {
          type: JobsActions.LOAD_JOBS_SUCCESS,
          payload: payload
      };
  }

  searchJobs(searchParams: any): Action {
    return {
      type: JobsActions.SEARCH_JOBS,
      payload: searchParams
    };
  }

  searchCompleteJobs(payload: any): Action {
    return {
      type: JobsActions.SEARCH_COMPLETE_JOBS,
      payload: payload
    };
  }

  loadGroupJobs(group: any, batch = 0): Action {
      return {
          type: JobsActions.LOAD_GROUPJOBS,
          payload: {
              group: group,
              batch: batch
          }
      };
  }

  loadGroupJobsSuccess(payload: any): Action {
      return {
          type: JobsActions.LOAD_GROUPJOBS_SUCCESS,
          payload: payload
      };
  }

  saveJob(job: any): Action {
      return {
          type: JobsActions.SAVE_JOB,
          payload: job
      };
  }

  saveJobSuccess(): Action {
      return {
          type: JobsActions.SAVE_JOB_SUCCESS
      };
  }

  saveJobFailure(): Action {
      return {
          type: JobsActions.SAVE_JOB_FAILURE
      };
  }
}
