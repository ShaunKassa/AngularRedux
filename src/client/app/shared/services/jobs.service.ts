import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/catch';

/**
 * This class provides the JobsService service with methods to get list of jobs.
 */
@Injectable()
export class JobsService {

   endpoint: string = 'http://52.10.1.113:3000/api/';
   filterService: string = 'http://index-service.rcp-p.solo-experiments.com:80/api/rest/v1/filter/box';

  /**
   * Creates a new JobsService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}


  fetchJobs(): Observable<any> {
      let that = this;
      var cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 10);
      //
      return this.http.get(this.endpoint +
              'Jobs?filter[where][and][0][parentjobid]=null&filter[where][and][1][createDate][gt]=' + cutoffDate.toISOString())
          .map(res => res.json())
          .map((jobs) =>
                  Observable.from(jobs)
                  .concatMap((job: any) => {
                      return this.http.get(this.endpoint + 'Jobs?filter[where][parentjobid]=' + job.id)
                          .map(res => {
                              job.children = res.json();
                              that.generatePercentages(job);
                              return job;
                          });
                  })
              )
          .concatAll()
          .groupBy(job => {
              return job.jobtypeid;
          })
      .flatMap(group => {
          return group.toArray();
      })
      .map((group: Array<any>) => {
          return {
              id: group[0].jobtypeid,
              jobs: group.sort((a, b) => {
                  let d1 = new Date(a.createDate);
                  let d2 = new Date(b.createDate);
                  return d2.getTime() - d1.getTime();
              })
          };
      }).toArray();
  }
  
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

  private generatePercentages(job: any) {
      let totalCount = job.children.length;
      job.slice = job.slice2 = job.slice3 = job.slice4 = 0;
      job.NotStartedCount = job.InProgressCount = job.FailedCount = job.SucceededCount = 0;

      if(totalCount === 0) {
          job.TotalCount = 1;
          if(job.status ==='NOT_STARTED') {
              job.slice = 100;
              job.NotStartedCount = 1;
          } else if(job.status ==='IN_PROGRESS') {
              job.slice2 = 100;
              job.InProgressCount = 1;
          } else if(job.status ==='FAILED') {
              job.slice3 = 100;
              job.FailedCount = 1;
          } else if(job.status ==='SUCCEEDED') {
              job.slice4 = 100;
              job.SucceededCount = 1;
          }
      } else {
          job.TotalCount = totalCount;
          job.NotStartedCount = job.children.filter((c: any) => c.status === 'NOT_STARTED').length;
          job.InProgressCount = job.children.filter((c: any) => c.status === 'IN_PROGRESS').length;
          job.FailedCount = job.children.filter((c: any) => c.status === 'FAILED').length;
          job.SucceededCount = job.children.filter((c: any) => c.status === 'SUCCEEDED').length;

          job.slice  = (job.NotStartedCount / totalCount) * 100;
          job.slice2 = (job.InProgressCount / totalCount) * 100;
          job.slice3 = (job.FailedCount / totalCount) * 100;
          job.slice4 = (job.SucceededCount / totalCount) * 100;
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
