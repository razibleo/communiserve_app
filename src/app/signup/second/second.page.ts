import { Component, OnInit } from '@angular/core';
import { PlaceLocation } from 'src/app/shared/models/location.model';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import {IonSelect, LoadingController } from '@ionic/angular';
import { NgControl, NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import{base64ToBlob} from 'base64toblob'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';





@Component({
  selector: 'app-second',
  templateUrl: './second.page.html',
  styleUrls: ['./second.page.scss'],
})
export class SecondPage implements OnInit {

  location:PlaceLocation;
  countries:any[];
  states:any[];
  cities:any[];
  auth_token:string;
  isLocationPicked = false;
  // selectedPhoto:string='';
  countryCode:string="Country Code"

  constructor(private httpClient:HttpClient, 
    private storage:Storage, 
    private router: Router,
    private authService: AuthService,
    private loadingController:LoadingController,
    private camera:Camera,
    private crop:Crop,
    private localNotifications: LocalNotifications){

    this.storage.get('Profile').then((val)=>{
      console.log('Value Retrived',val)
      
    })    
   }

  ngOnInit() {
    this.httpClient.get<any>("https://www.universal-tutorial.com/api/getaccesstoken",
    {
      headers:{
        "Accept": "application/json",
        "api-token": "jr7nrxPXAqgAhd7wQe3C0je4NIn8HPEM8NCCCz_4JoTt2B7X8we24o7eXh_rGXcgSmA",
        "user-email": "razibsarker@yahoo.com"
      }
    }
    ).pipe(take(1)).subscribe((data)=>{
      
      this.auth_token = data.auth_token;
      console.log(data);

      this.httpClient.get<any>("https://www.universal-tutorial.com/api/countries/",
      {
        headers:{
          "Authorization": "Bearer " + this.auth_token,
          "Accept": "application/json"
        }
      }
      ).pipe((take(1))).subscribe((countriesData)=>{this.countries = countriesData; console.log(this.countries)})
             
      })
    
  }

  onLocationPicked(location: PlaceLocation) {
    this.location = location;
    this.isLocationPicked = true;
  }

  getStates(countrySelect:IonSelect, stateSelect:NgControl){
    stateSelect.reset();
    console.log(countrySelect.value)
    this.httpClient.get<any>("https://www.universal-tutorial.com/api/states/"+countrySelect.value,
    {
      headers:{
        "Authorization": "Bearer " + this.auth_token,
        "Accept": "application/json"
      }
    }
    ).pipe(take(1)).subscribe((statesData)=>{

      this.states = statesData.map((data)=>{return data.state_name});
      console.log('States', this.states);
    })

    this.getCountryCode(countrySelect.value);
    
  }

  getCities(stateSelect:IonSelect, citySelect:NgControl){
    citySelect.reset();
    console.log(stateSelect.value)
    this.httpClient.get<any>("https://www.universal-tutorial.com/api/cities/"+ stateSelect.value,
    {
      headers:{
        "Authorization": "Bearer " + this.auth_token,
        "Accept": "application/json"
      }
    }
    ).pipe(take(1)).subscribe((citiesData)=>{

      this.cities = citiesData.map((data)=>{return data.city_name});
      console.log('Cities', this.cities);
      if(this.cities.length <= 0 ){this.cities.push(stateSelect.value)}
    })
    
  }

  getCountryCode(country:string){
    this.httpClient.get<any>("https://restcountries.eu/rest/v2/name/"+country).pipe(take(1)).subscribe((countryCode)=>this.countryCode='+'+countryCode[0].callingCodes[0], error=>{this.countryCode='Country Code'});
  }
  

  // async onCamera(){

  //   const options: CameraOptions = {
  //     quality: 50,
  //     destinationType: this.camera.DestinationType.FILE_URI
  //   }
  //     // let myphoto = imageData;
  //     // var blob = base64ToBlob(myphoto, 'image/png');
  //     // var url = URL.createObjectURL(blob);
  //     // console.log("myphoto", url)
  //     // this.selectedPhoto = url;

  //   let imageData = await this.camera.getPicture(options)
  //   let newImage = await this.crop.crop(imageData, {quality: 75})

  //   let win: any = window;
  //   let safeImageURL = win.Ionic.WebView.convertFileSrc(newImage);//
  //   console.log("safeImageURL", safeImageURL)
  //   this.selectedPhoto = safeImageURL
       
  // }

  // async getImageFromGallery() {
  //   const options: CameraOptions = {
  //     quality: 70,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //     saveToPhotoAlbum: false
  //   }
    
  //   let imageData = await this.camera.getPicture(options)
  //   let newImage = await this.crop.crop(imageData, {quality: 75})

  //   let win: any = window;
  //   let safeImageURL = win.Ionic.WebView.convertFileSrc(newImage);//
  //   console.log("safeImageURL", safeImageURL)
  //   this.selectedPhoto = safeImageURL
       
  // }


  async onSubmit(registrationForm:NgForm){

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });

    await loading.present();

    let form = registrationForm.form.value;
    let data ={
      address1: form.address1,
      address2: form.address2,
      poBox: form.zipcode,
      country: form.country,
      state: form.state,
      city: form.city,
      phoneNumber: this.countryCode + form.phoneNumber,
      placeLocation: {...this.location}
    }

    console.log(data);
    

        this.storage.get('Profile').then((val)=>{           
        this.authService.updateUserDataToFireStore({...val,...data})
        .then(()=>{
          loading.dismiss();

          this.localNotifications.schedule({
             title: 'Welcome To Communiserve',
              text: 'Help others and get rewarded...',
              foreground: true
          });


          this.router.navigate(['community-requests/home']);})
    })

  }

}
