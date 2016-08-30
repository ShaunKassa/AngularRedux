import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobsActions } from '../actions/index';

export interface JobsState {
    loaded: boolean;
    loading: boolean;
    jobs: Array<any>;
    lastUpdated?: Date;
}

const initialState: JobsState = {
    loaded: false,
    loading: false,
    jobs: []
};

export default (state: JobsState = initialState, action: Action) => {
        switch(action.type) {
            case JobsActions.REQUEST_JOBS:
                return Object.assign({}, state, {
                    loading: true
                });
            case JobsActions.RECEIVE_JOBS:
                return Object.assign({}, state, {
                    loaded: true,
                    loading: false,
                    jobs: action.payload
                });
            default:
                return state;
        }
};

