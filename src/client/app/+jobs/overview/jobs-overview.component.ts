import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {JobsActions} from '../../shared/actions/index';
import { getJobsForGroups } from '../../shared/reducers/index';
import { SearchComponent } from './search.component';



@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css'],
  providers:[SearchComponent]
})
export class JobsOverviewComponent {
    groups: any;

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
}
