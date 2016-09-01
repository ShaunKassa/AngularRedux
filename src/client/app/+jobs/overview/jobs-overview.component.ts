import { Component, Input, ElementRef, ViewChild, Renderer} from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {JobsActions} from '../../shared/actions/index';
import { getJobTypesWithJobs } from '../../shared/reducers/index';



@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css']
})
export class JobsOverviewComponent {
    groups: any;

    @Input() isOpen = true;
    @ViewChild('groups_container') jobsGroupsRef:ElementRef;

    constructor(private _store: Store<any>, private jobsActions: JobsActions, private _router: Router, private renderer: Renderer) {
        //todo: move this to its own selector
        this.groups = _store.let(getJobTypesWithJobs());
    }

    onExapandGroup($event, group: any) {
        this._store.dispatch(this.jobsActions.loadGroupJobs(group, 0));
    }

    onGetMore(group: any) {
        this._store.dispatch(this.jobsActions.loadGroupJobs(group, group.jobs.length/10));
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
