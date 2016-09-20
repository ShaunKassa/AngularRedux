import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobInputsActions } from '../actions/index';

export interface JobInputsState {
    loaded: boolean;
    loading: boolean;
    jobInputs: Array<any>;
    lastUpdated?: Date;
}

const initialState: JobInputsState = {
    loaded: false,
    loading: false,
    jobInputs: []
};

export default (state: JobInputsState = initialState, action: Action) => {
        switch(action.type) {
            case JobInputsActions.REQUEST_JOBINPUTS:
                return Object.assign({}, state, {
                    loading: true
                });
            case JobInputsActions.RECEIVE_JOBINPUTS:
                return Object.assign({}, state, {
                    loaded: true,
                    loading: false,
                    jobInputs: action.payload
                });
            default:
                return state;
        }
};
