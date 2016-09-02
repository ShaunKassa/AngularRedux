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
