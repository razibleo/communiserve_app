import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveRequestsDetailPage } from './active-requests-detail.page';

const routes: Routes = [
  {
    path: ':requestNumber',
    component: ActiveRequestsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveRequestsDetailPageRoutingModule {}
