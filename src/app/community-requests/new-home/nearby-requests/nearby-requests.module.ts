import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NearbyRequestsPageRoutingModule } from './nearby-requests-routing.module';

import { NearbyRequestsPage } from './nearby-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NearbyRequestsPageRoutingModule
  ],
  declarations: [NearbyRequestsPage]
})
export class NearbyRequestsPageModule {}
