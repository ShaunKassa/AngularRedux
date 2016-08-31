import { Component, Input, ElementRef, ViewChild, Renderer} from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {JobsActions} from '../../shared/actions/index';
import {getJobTypesWithJobs} from '../../shared/reducers/index';


import { OverviewChartComponent } from '../../shared/overviewChart/overview-chart.component';
// import { Ng2SliderComponent } from '../../shared/slider/ng2-slider.component';

@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css'],
  directives: [OverviewChartComponent]
})
export class JobsOverviewComponent {
    groups: any;
    @Input() isOpen = true;
    @ViewChild('groups_container') jobsGroupsRef:ElementRef;

    constructor(private _store: Store<any>, private jobsActions: JobsActions, private _router: Router, private renderer: Renderer) {
        this.groups = _store.let(getJobTypesWithJobs());
    }

    onExapandGroup(group: any) {
        this._store.dispatch(this.jobsActions.loadGroupJobs(group, 0));
        this.toggle(group.name);
    }

    onGetMore(group: any) {
        this._store.dispatch(this.jobsActions.loadGroupJobs(group, group.jobs.length/10));
    }

    private toggle(value:string) {
        this.renderer.setElementClass(this.jobsGroupsRef.nativeElement.getElementsByClassName(value)[0], 'show', true);
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
    private generateDegrees(job: any) {
        let circumference = 251.3;
        job.width1 = (job.slice) * circumference / 100;
        job.width2 = ((job.slice + job.slice2)) * circumference / 100;
        job.width3 = ((job.slice + job.slice2 + job.slice3)) * circumference / 100;
        if(Number.isInteger(job.slice3 + job.slice4)) {
            job.percent = job.slice3 + job.slice4;
        } else {
            job.percent = (Math.round((job.slice3 + job.slice4) * 100) / 100).toFixed(1);
        }
    }
    */
}
