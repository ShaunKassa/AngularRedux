import { Injectable } from '@angular/core';
import { CompleterItem } from '../ng2-completer/completer-item';
import { CompleterData } from '../ng2-completer/completer-data';
import { Store } from '@ngrx/store';
import { JobInputsActions } from '../actions/index';
import { getJobInputsSearchState } from '../reducers/index';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class JobInputsCustomData extends Subject<CompleterItem[]> implements CompleterData {

   constructor(private _store: Store<any>, private jobInputsActions: JobInputsActions) {
      super();
   }
   public search(term: string): void {
       this._store.dispatch(this.jobInputsActions.searchJobInputs(term));
       this._store.let(getJobInputsSearchState())
            .map(jobInputsSearchState => jobInputsSearchState.jobInputs)
            .map(inputs => {
                let matches: CompleterItem[] = inputs.map((input: any) => {
                //todo: use regex to extract the name part here for input.type
                    let indexValue = input.type.lastIndexOf('/');
                    let fileName = input.type.substr(indexValue + 1);
                    return {
                        title: fileName,
                        originalObject: input
                    };
                });

                this.next(matches);
            }).subscribe();
   }

 public cancel() {
     // Handle cancel
 }
}
