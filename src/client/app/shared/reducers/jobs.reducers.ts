import '@ngrx/core/add/operator/select';
import { Action, ActionReducer } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';


export interface AethicJobs {
    isFetching: boolean,
    didInvalidate?: boolean,
    jobs: Array<any>,
    lastUpdated?: Date
}


export const INVALIDATE_JOBS = 'INVALIDATE_AETHIC';
export const SELECT_JOB = 'SELECT_JOB';
export const REQUEST_JOBS = 'REQUEST_JOBS';
export const RECEIVE_JOBS = 'RECEIVE_POSTS';


export const jobs : ActionReducer<AethicJobs> = (state: AethicJobs = {
    isFetching: false,
    didInvalidate: false,
    jobs: []
}, action: Action) => {
    switch(action.type) {
        case INVALIDATE_JOBS:
            return Object.assign({}, state, {
                didInvalidate: true
            });
        case REQUEST_JOBS:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            })
        case RECEIVE_JOBS:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                jobs: action.payload.data.children((child: any) => child.data),
                lastUpdated: Date.now()
            });
        default:
            return state
    }
};
