import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

/**
 * This class provides the JobsService service with methods to get list of jobs.
 */
@Injectable()
export class JobsService {

   endpoint: string = 'http://52.10.1.113:3000/api/';  // production endpoint
   //endpoint: string = 'http://52.38.44.101:3000/api/'; // dev endpoint
   filterService: string = 'http://index-service.rcp-p.solo-experiments.com:80/api/rest/v1/filter/box';

  /**
   * Creates a new JobsService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  fetchJobTypes(): Observable<any> {
      return this.http.get(this.endpoint + 'Jobtypes')
          .map(res => res.json());
  }

  saveFilters(filtersPayload:any): Observable<any> {
    let body = JSON.stringify(filtersPayload);
    let headers = new Headers({ 'Content-Type': 'application/json', 'Access-Control-Request-Method': this.filterService });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.filterService, body, options)
                    .catch(this.handleError);
  }

  fetchJobsForGroup(group: any, batch): Observable<any> {
      let that = this;
      var initialLimit = 10;

      return this.http.get(this.endpoint + 'Jobs' +
                  '?filter[limit]=' + initialLimit +
                  '&filter[skip]=' + batch * initialLimit +
                  '&filter[include]=childJobs' +
                  '&filter[order]=createDate DESC' +
                  '&filter[where][and][0][parentjobid]=null' +
                  '&filter[where][and][1][jobtypeid]=' + group.id)
             .map(res => {
                 let parentJobs = res.json();
                 parentJobs.forEach(that.generatePercentages);
                 return parentJobs;
             });
  }

  fetchChildrenForJob(job: any): Observable<any> {
      let that = this;

      return this.http.get(this.endpoint + 'Jobs?filter[where][parentjobid]=' + job.id)
              .map(res => {
                  job.children = res.json();
                  that.generatePercentages(job);
                  that.generateTimeStamp(job);
                  that.generateStat(job);
                  return job;
              });
  }

  fetchChildrenForJobs(jobs: any): Observable<any> {
      let that = this;
      return Observable.from(jobs)
                .mergeMap((job: any) => {
                    return that.fetchChildrenForJob(job);
                });
  }

  private generatePercentages(job: any) {
      let totalCount = job.childJobs.length;
      job.slices = [0, 0, 0, 0];
      job.NotStartedCount = job.InProgressCount = job.FailedCount = job.SucceededCount = 0;

      if(totalCount === 0) {
          job.TotalCount = 1;
          if(job.status ==='NOT_STARTED') {
              job.slices[0] = 100;
              job.NotStartedCount = 1;
          } else if(job.status ==='IN_PROGRESS') {
              job.slices[1] = 100;
              job.InProgressCount = 1;
          } else if(job.status ==='FAILED') {
              job.slices[2] = 100;
              job.FailedCount = 1;
          } else if(job.status ==='SUCCEEDED') {
              job.slices[3] = 100;
              job.SucceededCount = 1;
          }
      } else {
          job.TotalCount = totalCount;
          job.NotStartedCount = job.childJobs.filter((c: any) => c.status === 'NOT_STARTED').length;
          job.InProgressCount = job.childJobs.filter((c: any) => c.status === 'IN_PROGRESS').length;
          job.FailedCount = job.childJobs.filter((c: any) => c.status === 'FAILED').length;
          job.SucceededCount = job.childJobs.filter((c: any) => c.status === 'SUCCEEDED').length;

          job.slices[0] = (job.NotStartedCount / totalCount) * 100;
          job.slices[1] = (job.InProgressCount / totalCount) * 100;
          job.slices[2] = (job.FailedCount / totalCount) * 100;
          job.slices[3] = (job.SucceededCount / totalCount) * 100;
      }
  }

  private generateTimeStamp(job: any) {
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

  private generateStat(job:any) {
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

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
