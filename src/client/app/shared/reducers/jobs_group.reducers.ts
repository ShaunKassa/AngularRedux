import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobsActions } from '../actions/index';

export interface GroupJobsState {
    groupJobs: {};
}

const initialState: GroupJobsState = {
    groupJobs: {}
};

export default (state: GroupJobsState = initialState, action: Action) => {
        switch(action.type) {
            case JobsActions.LOAD_GROUPJOBS: {
                const group: any = action.payload.group;

                if(state.groupJobs[group.id]) {
                    return state;
                }

                return {
                    groupJobs: Object.assign({}, state.groupJobs, {
                        [group.id]: {
                            loading: true,
                            loadedBatches: 0,
                            jobs: []
                        }
                    })
                };
            }
            case JobsActions.LOAD_GROUPJOBS_SUCCESS: {
                let groupId = action.payload.group.id;

                const jobs: any = action.payload.jobs;
                const newJobs: any = jobs.filter(job => !state.groupJobs[groupId].jobs[job.id]);

                return {
                    groupJobs: Object.assign({}, state.groupJobs, {
                        [groupId]: {
                            loadedBatches: state.groupJobs[groupId].loadedBatches + 1,
                            loading: false,
                            jobs: [...state.groupJobs[groupId].jobs, ...newJobs]
                        }
                    })
                };
            }
            default:
                return state;
        }
};
