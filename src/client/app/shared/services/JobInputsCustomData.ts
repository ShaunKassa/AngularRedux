import { Injectable } from '@angular/core';
import { CompleterData, CompleterItem } from 'ng2-completer';
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
                    return {
                        title: input.type,
                        originalObject: null
                    };
                });

                this.next(matches);
            }).subscribe();
   }

 public cancel() {
     // Handle cancel
 }
}
