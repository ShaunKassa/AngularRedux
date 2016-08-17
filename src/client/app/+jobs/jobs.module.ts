import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { JobsComponent } from './jobs.component';
import { JobsOverviewComponent } from './overview/jobs-overview.component';
import { JobsDetailviewComponent } from './detailview/jobs-detailview.component';
import { JobsCreateComponent } from './create/jobs-create.component';
import { routing } from './jobs.routing';


@NgModule({
    imports: [ CommonModule, routing, FormsModule, ReactiveFormsModule ],
    declarations: [JobsComponent, JobsOverviewComponent, JobsDetailviewComponent, JobsCreateComponent],
    exports: [JobsComponent]
})
export class JobsModule { }
