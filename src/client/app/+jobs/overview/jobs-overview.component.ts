import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';


import { OverviewChartComponent } from '../../shared/overviewChart/overview-chart.component';
// import { Ng2SliderComponent } from '../../shared/slider/ng2-slider.component';

@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css'],
  directives: [OverviewChartComponent]
})
export class JobsOverviewComponent implements OnInit {
    jobGroups: any;

    constructor(private _store: Store<any>, private _router: Router) {
        let that = this;

        this.jobGroups = Observable.combineLatest(
                _store.select('jobs'),
                _store.select('jobTypes'),
                (jobs_state: any, jobtypes_state: any) => {
                    let groups = jobs_state.jobs,
                        types = jobtypes_state.jobTypes;
                    groups.forEach((group: any) => {
                        group.jobs.forEach(that.generateDegrees);
                        group.jobs.forEach(that.displayTimeStamp);
                    });
                    groups.forEach((group: any) => {
                        let gt = types.filter((t: any) => t.id === group.id)[0];
                        group.name = gt ? gt.name : group.id;
                    });

                    return groups;
                });
    }

    ngOnInit() {
        console.log('OnInit');
    }

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
}
