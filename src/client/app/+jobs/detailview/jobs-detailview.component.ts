import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs/Rx';

@Component({
  moduleId: module.id,
  selector: 'jobs-detailview',
  templateUrl: 'jobs-detailview.component.html',
  styleUrls: ['jobs-detailview.component.css']
})
export class JobsDetailviewComponent implements AfterViewInit {
    jobGroups: any;

    constructor(private _store: Store<any>, private _route: ActivatedRoute, private _el: ElementRef) {
        let that = this;

        // this.jobGroups = Observable.combineLatest(
        //         _store.select('jobs'),
        //         _store.select('jobTypes'),
        //         (jobs_state: any, jobtypes_state: any) => {
        //             let groups = jobs_state.jobs,
        //                 types = jobtypes_state.jobTypes;
        //             groups.forEach((group: any) => {
        //                 group.jobs.forEach(that.generateDegrees);
        //                 group.jobs.forEach(that.displayTimeStamp);
        //                 group.jobs.forEach(that.displayStat);
        //             });
        //             groups.forEach((group: any) => {
        //                 let gt = types.filter((t: any) => t.id === group.id)[0];
        //                 group.name = gt ? gt.name : group.id;
        //             });

        //             return groups;
        //         });
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
        let circumference = 596.9;
        job.width1 = (job.slice) * circumference / 100;
        job.width2 = ((job.slice + job.slice2)) * circumference / 100;
        job.width3 = ((job.slice + job.slice2 + job.slice3)) * circumference / 100;
        if(Number.isInteger(job.slice3 + job.slice4)) {
            job.percent = job.slice3 + job.slice4;
        } else {
            job.percent = (Math.round((job.slice3 + job.slice4) * 100) / 100).toFixed(1);
        }
    }

    private displayStat(job) {
        let str = job.statistics;
        if(str !== null) {
            job.statistics = str.replace(/(?:\r\n|\r|\n)/g, '<br/><br/>');;
            let startOfId = job.statistics.lastIndexOf('jobId');
            let endOfId = job.statistics.indexOf('<br/>');
            if(startOfId >  0  && endOfId > startOfId) {
                job.statistics = '<div class="jobId"><div class="name">' + 'Statistics for jobId'+ '</div>'+
                    '<div class="Id">' + job.id +'</div></div><div>'+
                    job.statistics.slice(endOfId) +
                    '</div>';
            }
        }
    }

    ngAfterViewInit() {
        let id = parseInt(this._route.snapshot.params['id'], 10);
        let targetEl = $(this._el.nativeElement).find('#' + id)[0];
        if(targetEl) {
            targetEl.scrollIntoView();
        }
    }

}
