import {Injectable} from '@angular/core';
import {StateUpdates, Effect} from '@ngrx/effects';
import 'rxjs/add/operator/switchMap';
import {JobsService} from '../services/index';
import { JobTypesActions } from '../actions/index';


@Injectable()
export class JobTypesEffects {

    @Effect() fetchJobTypes$ = this._updates$
    .whenAction(JobTypesActions.REQUEST_JOBTYPES)
    .switchMap(() => (
        this._jobsService
        .fetchJobTypes()
        .map((jobTypes) => this.jobTypesActions.receiveJobTypes(jobTypes))
    ));

    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobTypesActions: JobTypesActions
    ) {}
}
