import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobsActions } from '../actions/index';

export interface JobsState {
    loaded: boolean;
    loading: boolean;
    loadedBatches: number;
    jobs: Array<any>;
}

const initialState: JobsState = {
    loadedBatches: 0,
    jobs: [],
    loaded: false,
    loading: false,
};

export default (state: JobsState = initialState, action: Action) => {
        switch(action.type) {
            case JobsActions.LOAD_JOBS: {
                return Object.assign({}, state, {
                    loading: true
                });
            }
            case JobsActions.LOAD_JOBS_SUCCESS: {
                const jobs: any = action.payload.jobs;
                const newJobs: any = jobs.filter(job => !state.jobs[job.id]);

                return Object.assign({}, state, {
                    loaded: true,
                    loading: false,
                    loadedBatches: state.loadedBatches + 1,
                    jobs: [...state.jobs, ...newJobs]
                });
             }
            default:
                return state;
        }
};
