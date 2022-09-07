import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { YourRequestsPage } from './your-requests.page';

const routes: Routes = [
  {
    path: '',
    component: YourRequestsPage
  },
  {
    path: 'your-requests-detail',
    loadChildren: () => import('./your-requests-detail/your-requests-detail.module').then( m => m.YourRequestsDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YourRequestsPageRoutingModule {}
