import { Component, ElementRef, ViewChild } from '@angular/core';
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
    groupedJobs: any;
    loadedBatches: any;
    jobsSearchForm: FormGroup;
    searchJobName: string = '';
    dateRangeText: string = '';
    statusText: string = '';
    @ViewChild('allStates') allStates:ElementRef;
    @ViewChild('notstarted') notstarted:ElementRef;
    @ViewChild('running') running:ElementRef;
    @ViewChild('successful') successful:ElementRef;
    @ViewChild('failed') failed:ElementRef;
    private _showSearchDialog = false;

    constructor(private _store: Store<any>,
                private jobsActions: JobsActions,
                private formBuilder:FormBuilder,
                private _router: Router) {
        this.createSearchForm();
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
                return acc.sort((a, b) => a.id - b.id);
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
        this.searchJobName = value.jobName;

        this.dateRangeText = '';
        if(value.timeSpan !== 'all time') {
            jobSearchParams.dateRange = {
                startDate: Date.parse(value.startDate),
                endDate: Date.parse(value.endDate)
            };
            this.dateRangeText += 'date: ' + value.startDate + ' - ' + value.endDate;
        } else {
            this.dateRangeText += 'date: all time';
        }

        this.statusText = '';
        if(value.states !== 'all') {
            jobSearchParams.states = [];
            let states = [];

            if(value.notstarted) {
                jobSearchParams.states.push('NOT_STARTED');
                states.push('not started');
            }
            if(value.running) {
                jobSearchParams.states.push('IN_PROGRESS');
                states.push('in progress');
            }
            if(value.successful) {
                jobSearchParams.states.push('SUCCEEDED');
                states.push('succeeded');
            }
            if(value.failed) {
                jobSearchParams.states.push('FAILED');
                states.push('failed');
            }
            if(states.length > 0) {
                this.statusText += ' status: ' + states.join(',');
            }
        } else {
            jobSearchParams.states.push('NOT_STARTED');
            jobSearchParams.states.push('IN_PROGRESS');
            jobSearchParams.states.push('SUCCEEDED');
            jobSearchParams.states.push('FAILED');
            this.statusText += ' status: all';
        }

        this._store.dispatch({type: JobsActions.SEARCH_JOBS, payload: jobSearchParams });
        this.showSearchDialog = false;
    }

    createSearchForm() {
        this.jobsSearchForm = this.formBuilder.group({
            jobName: [''],
            timeSpan:['all time'],
            startDate:[],
            endDate:[],
            states: ['all'],
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

    unCheck(event: any): void {
        if(!event.target.checked) {
            this.allStates.nativeElement.checked = false;
            this.allStates.nativeElement.value = '';
        }
        if(this.notstarted.nativeElement.checked &&
           this.running.nativeElement.checked &&
           this.successful.nativeElement.checked &&
           this.failed.nativeElement.checked) {
            this.allStates.nativeElement.checked = true;
        }
    }

    allCheck() {
        if(this.allStates.nativeElement.checked) {
            this.notstarted.nativeElement.checked = true;
            this.running.nativeElement.checked = true;
            this.successful.nativeElement.checked = true;
            this.failed.nativeElement.checked = true;
            this.allStates.nativeElement.value = 'all';
        }
    }
}
