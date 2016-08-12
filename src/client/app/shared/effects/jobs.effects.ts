import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import {Subject} from "rxjs/Subject";
import {JobsService} from "../services/index";
import {
    REQUEST_JOBS,
    RECEIVE_JOBS
} from "../reducers/index";


@Injectable()
export class JobsEffects{
    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService
    ){}
    
    @Effect() fetchJobs$ = this._updates$
            .whenAction(REQUEST_JOBS) 
            .switchMap(({action}) => (
                this._jobsService
                    .fetchJobs()
                    .map((jobs) => ({ type: RECEIVE_JOBS, payload: {jobs}})
            )));  
}
