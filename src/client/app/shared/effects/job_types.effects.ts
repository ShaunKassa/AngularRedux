import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import {Subject} from "rxjs/Subject";
import {JobsService} from "../services/index";
import { JobTypesActions } from '../actions/index';


@Injectable()
export class JobTypesEffects{
    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobTypesActions: JobTypesActions
    ){}
    
    @Effect() fetchJobTypes$ = this._updates$
        .whenAction(JobTypesActions.REQUEST_JOBTYPES)
        .switchMap(({action}) => (
                    this._jobsService
                    .fetchJobTypes()
                    .map((jobTypes) => this.jobTypesActions.receiveJobTypes(jobTypes))
                    ));
}
