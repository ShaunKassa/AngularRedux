import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect} from "@ngrx/effects";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import {Subject} from "rxjs/Subject";
import {JobsService} from "../services/index";
import {JobsActions} from '../actions/index';


@Injectable()
export class JobsEffects{
    constructor(
        private _updates$: StateUpdates<any>,
        private _jobsService : JobsService,
        private jobsActions: JobsActions
    ){}
    
    @Effect() fetchJobs$ = this._updates$
        .whenAction(JobsActions.REQUEST_JOBS) 
        .switchMap(({action}) => (
                    this._jobsService
                    .fetchJobs()
                    .map((jobs) => this.jobsActions.receiveJobs(jobs))
                    ));  
}