import { Component, OnInit } from '@angular/core';
import { AddRequestModalComponent } from 'src/app/shared/add-request-modal/add-request-modal.component';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';
import { ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';
import { Haversine, GpsPoint } from 'haversine-position';
import { RequestModalComponent } from 'src/app/shared/request-modal/request-modal.component';


export interface NearbyUser{
  user:User;
  distance:number;
}

@Component({
  selector: 'app-nearby-requests',
  templateUrl: './nearby-requests.page.html',
  styleUrls: ['./nearby-requests.page.scss'],
})
export class NearbyRequestsPage implements OnInit {
  private profile:User;
  private usersSubscription:Subscription;
   nearByUsers:NearbyUser[];
   isLoading:boolean = true;

  constructor(private storage:Storage, private userService:UserService, private modalController:ModalController) { }

  ngOnInit() {
  }


  async getAndSaveProfile(){
    let uid:string;
    await this.storage.get('Profile').then((val:User)=> {uid = val.uid})
    console.log("UID retrieved", uid)

    this.userService.getUserDataFromFireStore(uid).subscribe((user)=>{
      this.isLoading = true;
      this.profile = user;
      console.log('profile',this.profile)
      this.storage.set('Profile',user)
      .then(()=>{
        console.log("profile stored locally")

        this.nearByUsers = [];


        let profileLocation = {lat: this.profile.placeLocation.lat, lng: this.profile.placeLocation.lng}

        this.usersSubscription=this.userService.getUsers().subscribe(userList=>{
          console.log('data',userList);
          
    
          for(let i =0; i< userList.length; i++){
            let user = userList[i];
    
            if(this.profile.uid == user.uid){
              continue;
            } else{
              
         
              if(!user.photoURL){
                if(user.gender == 'Male'){
                              
                  user.photoURL = '/assets/avatars/male-avatar.png'
                } else{
                  user.photoURL = '/assets/avatars/female-avatar.png'
                }}
                            
              let userLocation = {lat:user.placeLocation.lat, lng:user.placeLocation.lng}
              let distance =Math.round(Haversine.getDistance(userLocation,profileLocation)/1000 *100)/100;

              console.log(distance)

              if(distance<=30){
                if(user.requests &&  user.requests.length>0){this.nearByUsers.push({user:user, distance:distance})}
                
              }

              
              
              
              
              // if(!user.requests){continue;}
    
              // console.log(user.username);
              // for(let x=0; x<user.requests.length; x++){
              //   console.log(user.requests[x]);
                
                
              // }
              
            }
          }

          


          this.nearByUsers = this.nearByUsers.filter((data)=>{
            return this.getAvailableRequests(data) !=0;
          })

          this.nearByUsers = this.nearByUsers.sort((a:NearbyUser,b:NearbyUser)=>{
            if (a.distance > b.distance){
              return 1
            }
            return -1})

          console.log(this.nearByUsers);
          this.isLoading = false;
        }
        )      
      });
    })

  
  }



  ionViewDidEnter(){
    console.log("new-home");
    this.getAndSaveProfile();
    
  }

  getAvailableRequests(nearbyUser:NearbyUser):number{
    let numberofAvailableRequests:number= 0;
    
    for(let i=0; i< nearbyUser.user.requests.length; i++){
    if(nearbyUser.user.requests[i].status==null || nearbyUser.user.requests[i].status=='Pending'){
      numberofAvailableRequests+= 1;
    }
    }
    return numberofAvailableRequests;
  }

  ngOnDestroy(){
    console.log("new-home destroyed");
    if(this.usersSubscription){
      this.usersSubscription.unsubscribe();
    }
  }
  
  addRequest(){
    this.modalController.create({ component: AddRequestModalComponent}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
      });
      modalEl.present();
    })   
    
  }

  onClickNearbyUser(user:User){

    this.modalController.create({ component: RequestModalComponent, componentProps: {user: user}}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {

         
      });
      modalEl.present();

  })}


}
