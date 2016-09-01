import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { JobsActions } from '../../shared/actions/index';
import { AccordionComponent } from '../../shared/accordion/accordion';
import { getJobsForGroups } from '../../shared/reducers/index';


@Component({
  moduleId: module.id,
  selector: 'jobs-detailview',
  templateUrl: 'jobs-detailview.component.html',
  styleUrls: ['jobs-detailview.component.css']
})
export class JobsDetailviewComponent implements OnInit, AfterViewInit {
    @ViewChild(AccordionComponent) accordion: AccordionComponent;
    groups: any;
    groupId: Observable<string>;
    jobId: Observable<string>;

    constructor(private _store: Store<any>, private jobsActions: JobsActions,
        private _el: ElementRef, private _route: ActivatedRoute) {
        this.groups = _store.let(getJobsForGroups());
    }

    ngOnInit() {
         this.groupId = this._route.queryParams.map(params => params['groupId']);
         this.jobId = this._route.queryParams.map(params => params['jobId']);
    }

    ngAfterViewInit() {
        let that = this;
        that.groupId.subscribe(groupId => {
            that.accordion.openGroup(groupId);
            that.jobId.subscribe(jobId => {
                let id ='[id="' +  parseInt(jobId, 10) + '"]';
                let targetEl = that._el.nativeElement.querySelector(id);
                if(targetEl) {
                    setTimeout(() => {
                        targetEl.scrollIntoView();
                    }, 1);
                }
            });
        });
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

    private displayStat(job:any) {
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
    */

}
