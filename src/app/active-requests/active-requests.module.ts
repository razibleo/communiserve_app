import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActiveRequestsPageRoutingModule } from './active-requests-routing.module';

import { ActiveRequestsPage } from './active-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActiveRequestsPageRoutingModule
  ],
  declarations: [ActiveRequestsPage]
})
export class ActiveRequestsPageModule {}
