import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunityRequestsPageRoutingModule } from './community-requests-routing.module';

import { CommunityRequestsPage } from './community-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityRequestsPageRoutingModule
  ],
  declarations: [CommunityRequestsPage]
})
export class CommunityRequestsPageModule {}
