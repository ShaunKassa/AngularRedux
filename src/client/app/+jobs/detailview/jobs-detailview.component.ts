import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';
import { JobsActions } from '../../shared/actions/index';
import { AccordionComponent } from '../../shared/accordion/accordion';
import { getJobsState, getJobsForGroups, getJobsSearchState } from '../../shared/reducers/index';


@Component({
  moduleId: module.id,
  selector: 'jobs-detailview',
  templateUrl: 'jobs-detailview.component.html',
  styleUrls: ['jobs-detailview.component.css']
})
export class JobsDetailviewComponent implements OnInit, AfterViewInit {
    @ViewChild(AccordionComponent) accordion: AccordionComponent;
    groups: any;
    jobs: any;
    searchGroupedJobs: any;
    groupedJobs: any;
    loadedBatches: any;
    groupId: Observable<string>;
    jobId: Observable<string>;

    constructor(private _store: Store<any>, private jobsActions: JobsActions,
        private _el: ElementRef, private _route: ActivatedRoute) {
        this.groups = _store.let(getJobsForGroups());
        this.groupedJobs = _store.let(getJobsSearchState())
        .select(state => {
            return state.jobs.reduce((acc, job) => {
                let key = job.jobtypeid;
                let group = acc.filter(group => group.id === key)[0];
                if(!group) {
                    group = { id: key, jobs: [] };
                    acc.push(group);
                }
                group.jobs.push(job);
                return acc;
            }, []);
        });
        this.searchGroupedJobs = this.groupedJobs.combineLatest(this.groups, (groupedJobs, groups) => {
            groupedJobs.forEach(group => {
                group.name = groups.filter(g => g.id === group.id)[0].name;
            });
            return groupedJobs;
        });
        this.jobs = _store.let(getJobsState()).select(state => state.jobs);
        this.loadedBatches = _store.let(getJobsState()).select(state => state.loadedBatches);
    }

    ngOnInit() {
         this.groupId = this._route.queryParams.map(params => params['groupId']);
         this.jobId = this._route.queryParams.map(params => params['jobId']);
    }

    onLoadMore(batch: number) {
        this._store.dispatch(this.jobsActions.loadJobs(batch));
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
}
