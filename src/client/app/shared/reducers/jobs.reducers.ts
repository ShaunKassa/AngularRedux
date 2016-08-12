import '@ngrx/core/add/operator/select';
import { Action, ActionReducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';


export interface AethicJobs {
    isFetching: boolean,
    jobs: Array<any>,
    lastUpdated?: Date
}

export interface AethicJobTypes {
    isFetching: boolean,
    jobTypes: Array<any>,
    lastUpdated?: Date
}


export const REQUEST_JOBS = 'REQUEST_JOBS';
export const RECEIVE_JOBS = 'RECEIVE_POSTS';
export const REQUEST_JOBTYPES = 'REQUEST_JOBTYPES';
export const RECEIVE_JOBTYPES = 'RECEIVE_JOBTYPES';


export const jobs : ActionReducer<AethicJobs> = (state: AethicJobs = {
    isFetching: false,
    jobs: []
}, action: Action) => {
    switch(action.type) {
        case REQUEST_JOBS:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_JOBS:
            return Object.assign({}, state, {
                isFetching: false,
                jobs: action.payload.jobs,
                lastUpdated: Date.now()
            });
        default:
            return state
    }
};

export const jobTypes : ActionReducer<AethicJobTypes> = (state: AethicJobTypes = {
    isFetching: false,
    jobTypes: []
}, action: Action) => {
    switch(action.type) {
        case REQUEST_JOBTYPES:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_JOBTYPES:
            return Object.assign({}, state, {
                isFetching: false,
                jobTypes: action.payload.jobTypes,
                lastUpdated: Date.now()
            });
        default:
            return state
    }
};
