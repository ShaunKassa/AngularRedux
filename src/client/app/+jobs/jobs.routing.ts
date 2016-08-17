import { Routes, RouterModule } from '@angular/router';

import { JobsComponent } from './index';
import { JobsOverviewComponent } from './overview/index';
import { JobsDetailviewComponent } from './detailview/index';
import { JobsCreateComponent } from './create/index';

const routes: Routes = [
  {
      path: '',
      redirectTo: '/jobs/overview',
      pathMatch: 'full'
  },
  {
    path: 'jobs',
    component: JobsComponent,
    children: [
        { path: 'overview', component: JobsOverviewComponent },
        { path: 'detailview', component: JobsDetailviewComponent },
        { path: 'create', component: JobsCreateComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
