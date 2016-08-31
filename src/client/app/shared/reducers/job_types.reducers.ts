import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobTypesActions } from '../actions/index';

export interface JobTypesState {
    loaded: boolean;
    loading: boolean;
    jobTypes: Array<any>;
    lastUpdated?: Date;
}

const initialState: JobTypesState = {
    loaded: false,
    loading: false,
    jobTypes: []
};

export default (state: JobTypesState = initialState, action: Action) => {
        switch(action.type) {
            case JobTypesActions.REQUEST_JOBTYPES:
                return Object.assign({}, state, {
                    loading: true
                });
            case JobTypesActions.RECEIVE_JOBTYPES:
                return Object.assign({}, state, {
                    loaded: true,
                    loading: false,
                    jobTypes: action.payload
                });
            default:
                return state;
        }
};
