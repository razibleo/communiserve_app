import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourRequestsDetailPageRoutingModule } from './your-requests-detail-routing.module';

import { YourRequestsDetailPage } from './your-requests-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourRequestsDetailPageRoutingModule
  ],
  declarations: [YourRequestsDetailPage]
})
export class YourRequestsDetailPageModule {}
