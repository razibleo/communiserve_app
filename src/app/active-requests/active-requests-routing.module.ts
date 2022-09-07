import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveRequestsPage } from './active-requests.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveRequestsPage
  },
  {
    path: 'active-requests-detail',
    loadChildren: () => import('./active-requests-detail/active-requests-detail.module').then( m => m.ActiveRequestsDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveRequestsPageRoutingModule {}
