import {Injectable} from '@angular/core';
import {StateUpdates, Effect, toPayload} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import { JobsService } from '../services/index';
import { JobInputsActions } from '../actions/index';


@Injectable()
export class JobInputsEffects {

    @Effect() fetchJobInputs$ = this._updates$
    .whenAction(JobInputsActions.REQUEST_JOBINPUTS)
    .switchMap(() => (
        this._jobsService
        .fetchJobInputs()
        .map((jobInputs) => this.jobInputsActions.receiveJobInputs(jobInputs))
    ));

    @Effect() searchJobInputs$ = this._updates$
    .whenAction(JobInputsActions.SEARCH_JOBINPUTS)
    .map(toPayload)
    .switchMap((query: String) => (
        this._jobsService
        .searchJobInputs(query)
        .map((jobInputs) => this.jobInputsActions.searchCompleteJobInputs(jobInputs))
    ));

    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobInputsActions: JobInputsActions
    ) {}
}

