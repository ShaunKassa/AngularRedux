import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path:'jobs', loadChildren: './jobs/jobs.module' }
];

export const routing = RouterModule.forRoot(routes);


