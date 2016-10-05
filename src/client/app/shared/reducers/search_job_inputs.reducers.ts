import '@ngrx/core/add/operator/select';
import { Action } from '@ngrx/store';
import { JobInputsActions } from '../actions/index';


export interface JobInputsSearchState {
  jobInputs: Array<any>;
  loading: boolean;
  query: string;
};

const initialState: JobInputsSearchState = {
  jobInputs: [],
  loading: false,
  query: ''
};

export default (state: JobInputsSearchState = initialState, action: Action) => {
  switch (action.type) {
    case JobInputsActions.SEARCH_JOBINPUTS: {
      const query = action.payload;

      if (query === '') {
        return {
          jobInputs: [],
          loading: false,
          query
        };
      }

      return Object.assign({}, state, {
        query,
        loading: true
      });
    }

    case JobInputsActions.SEARCH_COMPLETE_JOBINPUTS: {

      return {
        jobInputs: action.payload,
        loading: false,
        query: state.query
      };
    }

    default: {
      return state;
    }
  }
};
