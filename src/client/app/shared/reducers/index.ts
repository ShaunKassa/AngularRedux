import '@ngrx/core/add/operator/select';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/let';
import { Observable } from 'rxjs/Observable';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeLogger is a powerful metareducer that logs out each time we dispatch
 * an action.
 *
 * A metareducer wraps a reducer function and returns a new reducer function
 * with superpowers. They are handy for all sorts of tasks, including
 * logging, undo/redo, and more.
 */
import { storeLogger } from 'ngrx-store-logger';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';


/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import jobsReducer, * as fromJobs from './jobs.reducers';
import jobTypesReducer, * as fromJobTypes from './job_types.reducers';

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface AppState {
  jobs: fromJobs.JobsState;
  jobTypes: fromJobTypes.JobTypesState;
}


/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
export default compose(storeFreeze, storeLogger(), combineReducers)({
  jobs: jobsReducer,
  jobTypes: jobTypesReducer
});


/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `books` state.
 *
 * Selectors are used with the `let` operator. They take an input observable
 * and return a new observable. Here's how you would use this selector:
 *
 * ```ts
 * class MyComponent {
 * 	constructor(state$: Observable<AppState>) {
 * 	  this.jobsState$ = state$.let(getJobsState());
 * 	  this.jobTypesState$ = state$.let(getJobTypesState());
 * 	}
 * }
 * ```
 */


/*
 *
 *
 * Selectors for jobs
 */
 export function getJobsState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.jobs);
}

export function getJobsForGroups(groups: any) {
    return compose(fromJobs.getJobsForGroups(groups), getJobsState());
}


/*
 *
 *
 * Selectors for job tyeps
 */
export function getJobTypesState() {
  return (state$: Observable<AppState>) => state$
    .select(s => s.jobTypes);
}


/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of books in the store.
 */

export function getJobTypesWithJobs() {
    return (state$: Observable<AppState>) => state$
        .let(getJobTypesState())
        .switchMap(jobTypesState => state$.let(getJobsForGroups(jobTypesState.jobTypes)));
}
