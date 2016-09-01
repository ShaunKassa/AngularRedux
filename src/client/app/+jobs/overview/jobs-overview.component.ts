import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {JobsActions} from '../../shared/actions/index';
import { getJobsForGroups } from '../../shared/reducers/index';



@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css']
})
export class JobsOverviewComponent {
    groups: any;
    paginationState: { [groupName: string]: number; } = {};

    constructor(private _store: Store<any>, private jobsActions: JobsActions, private _router: Router) {
        this.groups = _store.let(getJobsForGroups());
    }

    onExpandGroup($event, group: any) {
        let that = this;
        group.loadedBatches.subscribe(batch => {
            if(batch === 0) {
                that._store.dispatch(this.jobsActions.loadGroupJobs(group, batch));
            }
        });
    }

    onGetMore(group: any, batch: number) {
        this._store.dispatch(this.jobsActions.loadGroupJobs(group, batch));
    }


    /*
    private displayTimeStamp(job: any) {
        let time_1 = new Date(job.createDate);
        let result_1 = time_1.getTime();
        let currentTime = new Date();
        let currentTimeMill = currentTime.toISOString();
        let time_2 = new Date(currentTimeMill);
        let result_2 = time_2.getTime();

        let elapsedTime = result_2 - result_1;
        let seconds = (elapsedTime/1000)%60;
        let minutes = (elapsedTime/(1000*60))%60;
        let hours  = (elapsedTime/(1000*60*60))%24;
        job.createdDate = Math.round(hours) + ':' + Math.round(minutes) + ':' + Math.round(seconds);
    }
    */
}
