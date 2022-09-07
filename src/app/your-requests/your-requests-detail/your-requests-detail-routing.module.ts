import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourRequestsDetailPage } from './your-requests-detail.page';

const routes: Routes = [
  {
    path: ':requestNumber',
    component: YourRequestsDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourRequestsDetailPageRoutingModule {}
