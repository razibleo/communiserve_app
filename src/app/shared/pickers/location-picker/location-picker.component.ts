import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';
import { PlaceLocation, Coordinates } from '../../models/location.model';

import { Geolocation } from '@ionic-native/geolocation/ngx';


@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() selectable = true;
  @Input() placeLocation:PlaceLocation;
  @Input() selectedLocationImage: string;
  isLoading = false;
  

  constructor(private modalCtrl: ModalController, 
    private http: HttpClient, 
    private actionSheetController:ActionSheetController, private geolocation:Geolocation) {}

  ngOnInit() {}

  onClickButton(){
    if(this.selectable){
      this.presentActionSheet();
    } else{
      this.onPickLocation({lat:this.placeLocation.lat, lng: this.placeLocation.lng})
    }
    
  }

  onPickLocation(coordinates:Coordinates) {
    this.modalCtrl.create({ component: MapModalComponent, componentProps: {center: coordinates, selectable: this.selectable}}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const pickedLocation: PlaceLocation = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
          address: null,
          staticMapImageUrl: null
        };
        this.isLoading = true;
        this.emitLocation(pickedLocation)
   
      });
      modalEl.present();
    });
  }

   getAddress(lat: number, lng: number) {
  
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          environment.googleMapsAPIKey
        }`
      )
      .pipe(
        map(geoData => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }

  emitLocation(pickedLocation:PlaceLocation){
    this.getAddress(pickedLocation.lat, pickedLocation.lng)
    .pipe(
      switchMap(address => {
        pickedLocation.address = address;
        return of(
          this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
        );
      })
    )
    .subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.isLoading = false;
      this.locationPick.emit(pickedLocation);
    });
  }



  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Enter Location',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Auto-Locate',
        icon:'locate',
        handler: () => {
          this.isLoading = true;
          this.geolocation.getCurrentPosition().then((coordinates)=>{     
            console.log("coordinar", coordinates)  

            const pickedLocation: PlaceLocation = {
              lat: coordinates.coords.latitude,
              lng: coordinates.coords.longitude,
              address: null,
              staticMapImageUrl: null
            };     
            this.emitLocation(pickedLocation)
          })
        }
      }, {
        text: 'Pick on Map',
        icon: 'map',
        handler: () => {
          this.onPickLocation({ lat: 24.466949, lng: 54.374760 });
          
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
