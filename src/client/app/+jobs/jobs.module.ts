import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { JobsComponent } from './jobs.component';
import { JobsOverviewComponent } from './overview/jobs-overview.component';
import { SearchComponent } from './overview/search.component';
import { JobsDetailviewComponent } from './detailview/jobs-detailview.component';
import { JobsCreateComponent } from './create/jobs-create.component';
import { routing } from './jobs.routing';


@NgModule({
    imports: [ SharedModule, routing ],
    declarations: [JobsComponent, JobsOverviewComponent, JobsDetailviewComponent, JobsCreateComponent, SearchComponent],
    exports: [JobsComponent]
})
export class JobsModule { }
