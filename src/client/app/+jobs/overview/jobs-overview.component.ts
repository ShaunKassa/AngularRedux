import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { JobsActions } from '../../shared/actions/index';
import { getJobsState, getJobsForGroups, getJobsSearchState } from '../../shared/reducers/index';



@Component({
  moduleId: module.id,
  selector: 'jobs-overview',
  templateUrl: 'jobs-overview.component.html',
  styleUrls: ['jobs-overview.component.css']
})
export class JobsOverviewComponent {
    groups: any;
    jobs: any;
    searchGroupedJobs: any;
    loadedBatches: any;
    jobsSearchForm: FormGroup;
    private _showSearchDialog = false;

    constructor(private _store: Store<any>,
                private jobsActions: JobsActions,
                private formBuilder:FormBuilder,
                private _router: Router) {
        this.createSearchForm();
        this.groups = _store.let(getJobsForGroups());
        this.searchGroupedJobs = _store.let(getJobsSearchState()).select(state => {
            return state.jobs;
        });
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

    onSearchSubmit(value: any) {
        let jobSearchParams = {
            jobName: '',
            dateRange: {},
            states: []
        };
        jobSearchParams.jobName = value.jobName;
        if(value.timeSpan !== 'all') {
            jobSearchParams.dateRange = {
                startDate: Date.parse(value.startDate),
                endDate: Date.parse(value.endDate)
            };
        }

        if(value.states !== 'all') {
            jobSearchParams.states = [];
            if(value.notstarted) {
                jobSearchParams.states.push('NOT_STARTED');
            }
            if(value.running) {
                jobSearchParams.states.push('IN_PROGRESS');
            }
            if(value.successful) {
                jobSearchParams.states.push('SUCCEEDED');
            }
            if(value.failed) {
                jobSearchParams.states.push('FAILED');
            }
        } else {
            jobSearchParams.states.push('NOT_STARTED');
            jobSearchParams.states.push('IN_PROGRESS');
            jobSearchParams.states.push('SUCCEEDED');
            jobSearchParams.states.push('FAILED');
        }

        this._store.dispatch({type: JobsActions.SEARCH_JOBS, payload: jobSearchParams });
    }

    createSearchForm() {
        this.jobsSearchForm = this.formBuilder.group({
            jobName: [''],
            timeSpan:['all'],
            startDate:[],
            endDate:[],
            states: [],
            notstarted: [],
            running: [],
            successful: [],
            failed:[]
        });
    }

    get showSearchDialog(): boolean {
        return this._showSearchDialog;
    }

    set showSearchDialog(value: boolean) {
        this._showSearchDialog = value;
    }
}
