import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { YourRequestsPageRoutingModule } from './your-requests-routing.module';

import { YourRequestsPage } from './your-requests.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    YourRequestsPageRoutingModule,
    SharedModule
  ],
  declarations: [YourRequestsPage]
})
export class YourRequestsPageModule {}
