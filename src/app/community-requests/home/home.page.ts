import { Component, OnInit, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { Subscription } from 'rxjs';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  private profile:User;
  private profileSubscription:Subscription;

  constructor(private storage:Storage, private userService:UserService, private localNotifications:LocalNotifications) { 
  }

 
  ngOnInit() {
    this.getAndSaveProfile();
    this.localNotifications.schedule({
      title: 'Welcome To Communiserve',
       text: 'Help others and get rewarded...',
       foreground: true
   });
    this.localNotifications.requestPermission().then(((granted)=>{ 
      

    }))
  
    
  }

  async getAndSaveProfile(){
    let uid:string;
    await this.storage.get('Profile').then((val:User)=> {uid = val.uid})
    console.log("UID retrieved", uid)

    this.profileSubscription = this.userService.getUserDataFromFireStore(uid).subscribe((user)=>{
      this.profile = user;
      console.log('profile',this.profile)
      this.storage.set('Profile',user)
      .then(()=>{console.log("profile stored locally")});
    })       
  }

  ngOnDestroy(){
    if(this.profileSubscription){
      this.profileSubscription.unsubscribe();
    }
  }

 

 

}
