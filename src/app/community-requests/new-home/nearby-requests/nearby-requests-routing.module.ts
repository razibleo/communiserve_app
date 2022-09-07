import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NearbyRequestsPage } from './nearby-requests.page';

const routes: Routes = [
  {
    path: '',
    component: NearbyRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NearbyRequestsPageRoutingModule {}
