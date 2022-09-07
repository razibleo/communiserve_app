
import { Component, OnInit,OnDestroy } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { Storage } from '@ionic/storage';
import { User } from '../shared/models/user.model';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-active-requests',
  templateUrl: './active-requests.page.html',
  styleUrls: ['./active-requests.page.scss'],
})
export class ActiveRequestsPage implements OnInit, OnDestroy {

  profile:User;
  isLoading = true;
  userDataSubsription:Subscription;

 constructor(private userService:UserService, private storage:Storage) { }

 async ngOnInit() {

  this.isLoading = true;
   let profile:User = await this.storage.get('Profile')
  
   this.userDataSubsription= this.userService.streamUserDataFromFireStore(profile.uid).subscribe(user =>{
     this.profile = user;  
     
     if(!this.profile.activeRequests){
       this.isLoading =false;
       return;}     

     for(let i=0; i< this.profile.activeRequests.length; i++){
       let requestItem = this.profile.activeRequests[i];
         requestItem.acceptedDate = new firebase.firestore.Timestamp(requestItem.submittedDate.seconds, requestItem.submittedDate.nanoseconds).toDate();  
     }
     this.isLoading = false;
   })  
 }




 ionViewWillLeave(){
  if(this.userDataSubsription != null){
    this.userDataSubsription.unsubscribe();
   }     
 }
 



 ngOnDestroy(){
  console.log("active requests destroyed");
   if(this.userDataSubsription != null){
    this.userDataSubsription.unsubscribe();
   }     
 }


 getColor(status):string{

  if(status == null || status == 'Pending'){

    return 'danger';

  } else if(status == 'Accepted'){

    return  'warning';

  } else{

    return 'success';

  }

 }


}



