import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveRequestsDetailPageRoutingModule } from './active-requests-detail-routing.module';

import { ActiveRequestsDetailPage } from './active-requests-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveRequestsDetailPageRoutingModule
  ],
  declarations: [ActiveRequestsDetailPage]
})
export class ActiveRequestsDetailPageModule {}
