import {Injectable} from '@angular/core';
import {StateUpdates, Effect, toPayload} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/observable/bindCallback';
import {JobsService} from '../services/index';
import {JobsActions} from '../actions/index';


@Injectable()
export class JobsEffects {

    @Effect() saveJob$ = this._updates$
        .whenAction(JobsActions.SAVE_JOB)
        .map(toPayload)
        .switchMap((job: any) => {
            return null;
        });

    @Effect() loadJobs$ = this._updates$
        .whenAction(JobsActions.LOAD_JOBS)
        .map(toPayload)
        .concatMap(({batch}) => {
            return this._jobsService
                    .fetchJobs(batch)
                    .map((jobs) => this.jobsActions.loadJobsSuccess(
                                {jobs: jobs}
                                ));
        });

    @Effect() searchJobs$ = this._updates$
        .whenAction(JobsActions.SEARCH_JOBS)
        .map(toPayload)
        .concatMap((searchParams) => {
            return this._jobsService
                    .searchJobs(searchParams)
                    .map((jobs) => this.jobsActions.searchCompleteJobs(
                                {jobs: jobs}
                                ));
        });

    @Effect() loadJobsForGroup$ = this._updates$
        .whenAction(JobsActions.LOAD_GROUPJOBS)
        .map(toPayload)
        .concatMap(({group, batch}) => {
            return this._jobsService
                    .fetchJobsForGroup(group, batch)
                    .map((jobs) => this.jobsActions.loadGroupJobsSuccess(
                                {group:group, jobs: jobs}
                                ));
        });

    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobsActions: JobsActions
    ) {}
}
