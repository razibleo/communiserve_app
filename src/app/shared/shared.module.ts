import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { RequestPickerComponent } from './request-picker/request-picker.component';
import { RequestModalComponent } from './request-modal/request-modal.component';
import { AddRequestModalComponent } from './add-request-modal/add-request-modal.component';

@NgModule({
  declarations: [LocationPickerComponent, MapModalComponent,RequestPickerComponent,RequestModalComponent,AddRequestModalComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [LocationPickerComponent, MapModalComponent,RequestPickerComponent,RequestModalComponent,AddRequestModalComponent],
  entryComponents: [MapModalComponent]
})
export class SharedModule {}
