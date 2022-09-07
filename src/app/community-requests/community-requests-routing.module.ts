import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommunityRequestsPage } from './community-requests.page';

const routes: Routes = [
  {
    path: '',
    component: CommunityRequestsPage,
    children: [
      // {
      //   path: 'home',
      //   loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      // },

      {
        path: 'home',
        loadChildren: () => import('./new-home/new-home.module').then( m => m.NewHomePageModule)
      },
    
      {
        path: 'search',
        loadChildren: () => import('./search/search.module').then( m => m.SearchPageModule)
      },
    ]
  },
 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRequestsPageRoutingModule {}
