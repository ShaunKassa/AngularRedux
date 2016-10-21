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

      if (!searchParams) {
        return {
          jobInputs: [],
          loading: false,
          searchParams
        };
      }

      return Object.assign({}, state, {
        searchParams,
        loading: true
      });
    }

    case JobsActions.SEARCH_COMPLETE_JOBS: {

      return {
        jobs: action.payload,
        loading: false,
        searchParams: state.searchParams
      };
    }

    default: {
      return state;
    }
  }
};
