import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobsActions } from '../actions/index';


export interface JobsSearchState {
  jobs: Array<any>;
  loading: boolean;
  searchParams: any;
};

const initialState: JobsSearchState = {
  jobs: [],
  loading: false,
  searchParams: {}
};

export default (state: JobsSearchState = initialState, action: Action) => {
  switch (action.type) {
    case JobsActions.SEARCH_JOBS: {
      const searchParams = action.payload;

      //todo: check the inners of the searchParam to see if this has any new parameters
      if (!searchParams) {
        return {
          job: [],
          loading: false,
          searchParams
        };
      }

      return Object.assign({}, state, {
        jobs: [],
        searchParams,
        loading: true
      });
    }

    case JobsActions.SEARCH_COMPLETE_JOBS: {
      return {
        jobs: action.payload.jobs,
        loading: false,
        searchParams: state.searchParams
      };
    }

    default: {
      return state;
    }
  }
};
