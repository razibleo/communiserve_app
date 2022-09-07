import { Component, OnInit,OnDestroy, AfterViewInit, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';
import {} from 'googlemaps';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ModalController } from '@ionic/angular';
import { RequestModalComponent } from '../request-modal/request-modal.component';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-request-picker',
  templateUrl: './request-picker.component.html',
  styleUrls: ['./request-picker.component.scss'],
})
export class RequestPickerComponent implements OnInit, AfterViewInit,OnDestroy {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() center = { lat: 24.466949, lng: 54.374760 };
  @Input() selectable = true;
  clickListener: any;
  googleMaps: any;
  map:google.maps.Map;

  profile:User;
  usersList:User[]=[];


  constructor(private renderer:Renderer2, private userService:UserService, private modalController:ModalController, private storage:Storage) { }

  async ngOnInit() { 
    let profile:User= await this.storage.get('Profile')
    this.profile = profile;
  }

  ngAfterViewInit() {
    console.log('google maps called');
    
    
    
    this.getGoogleMaps()
      .then(googleMaps => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 13
        });
        this.map=map;

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible');
        });


        this.clickListener = map.addListener('click', event => {
          const selectedCoords = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          };
          // this.modalCtrl.dismiss(selectedCoords);
        });

        // const marker = new googleMaps.Marker({
        //   position: this.center,
        //   map: map,
       
        // });
        // marker.setMap(map);

           this.userService.getUsers().subscribe(user => {

            let filteredUsers = user.filter(data =>{return (data.username != this.profile.username) && data.requests})   

            for(let i=0; i< filteredUsers.length;i++){
              this.usersList.push(filteredUsers[i])

            }
            console.log("usersList", this.usersList.length);
            this.drop();
            }
          )

     


      })
      .catch(err => {
        console.log(err);
      });

  }


  drop() {  
    console.log('len', this.usersList.length);
    for (let i = 0; i < this.usersList.length; i++) {
      
      
   


      this.addMarkerWithTimeout(this.usersList[i], i * 50);
    }
  }




  ngOnDestroy() {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }


  addMarkerWithTimeout(
    user: User,
    timeout: number
  ) {
    let icon:string = 'orange-dot';
    if(!this.isPending(user)){icon='red-dot'}
    setTimeout(() => {
   
    let marker= new google.maps.Marker({
          position: {lat: user.placeLocation.lat, lng: user.placeLocation.lng},
          map:this.map,
          // icon: {
          //   url: "https://raw.githubusercontent.com/Concept211/Google-Maps-Markers/master/images/marker_green"+user.requests.length+".png"
          // },
          icon: {
            url: "/assets/icon/"+icon+".png"
          },
          animation: google.maps.Animation.DROP
         
        })

        marker.addListener('click',this.markeronClick.bind(this,user, marker))
      
    }, timeout);
    // let marker= new google.maps.Marker({
    //   position: {lat: user.placeLocation.lat, lng: user.placeLocation.lng},
    //   map:this.map,
    //   icon: {
    //     url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    //   },
    //   animation: google.maps.Animation.DROP
     
    // })

    // marker.addListener('click',this.markeronClick.bind(this,user, marker))
  }

  markeronClick(user:User, marker:google.maps.Marker){
    this.map.panTo(marker.getPosition() as google.maps.LatLng);
    this.map.setZoom(13)
    this.modalController.create({ component: RequestModalComponent, componentProps: {user: user}}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {

        
        if(!this.isPending(user)){marker.setIcon("/assets/icon/red-dot.png")}
          
           
      });
      modalEl.present();
    });
    
  }  

  
  isPending(user:User):boolean{
        for(let i=0; i< user.requests.length; i++){

          if(user.requests[i].status==null || user.requests[i].status=="Pending"){
            console.log('true');
            
            return true;
          }
        }
        return false;

  }
  

}
