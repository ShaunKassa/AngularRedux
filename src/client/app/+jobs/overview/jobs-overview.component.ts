import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {JobsActions} from '../../shared/actions/index';
import { getJobsState, getJobsForGroups } from '../../shared/reducers/index';



@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css']
})
export class JobsOverviewComponent {
    groups: any;
    jobs: any;
    loadedBatches: any;

    constructor(private _store: Store<any>, private jobsActions: JobsActions, private _router: Router) {
        this.groups = _store.let(getJobsForGroups());
        this.jobs = _store.let(getJobsState()).select(state => state.jobs);
        this.loadedBatches = _store.let(getJobsState()).select(state => state.loadedBatches);
        this._store.dispatch(this.jobsActions.loadJobs(0));
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

    onLoadMore(batch: number) {
        this._store.dispatch(this.jobsActions.loadJobs(batch));
    }
}
