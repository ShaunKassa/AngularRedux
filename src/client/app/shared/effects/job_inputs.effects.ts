import {Injectable} from '@angular/core';
import {StateUpdates, Effect} from '@ngrx/effects';
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

    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobInputsActions: JobInputsActions
    ) {}
}

