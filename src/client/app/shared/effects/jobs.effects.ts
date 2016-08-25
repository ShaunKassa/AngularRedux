import {Injectable} from "@angular/core";
import {Store, Action} from "@ngrx/store";
import {StateUpdates, Effect, toPayload} from "@ngrx/effects";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/mapTo";
import "rxjs/add/observable/bindCallback";
import {Subject} from "rxjs/Subject";
import {JobsService} from "../services/index";
import {JobsActions} from '../actions/index';
import { Config } from '../config/env.config';


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

    @Effect() saveJob$ = this._updates$
        .whenAction(JobsActions.SAVE_JOB)
        .map(toPayload)
        .switchMap((job: any) => {
            /* 
            let bucket:any = new S3({ params: { Bucket: 'aethicupload' }});
            let params:any = { Key: job.address, Body: job.text }
            let upload:any  = Observable.bindCallback(bucket.upload);
            let result:Observable<any> = upload(params);
            result.mapTo(this.jobsActions.saveJobSuccess(job));
            */
            return null;
        });
}
