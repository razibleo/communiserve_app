import { Component, OnInit,OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AddRequestModalComponent } from '../shared/add-request-modal/add-request-modal.component';
import { UserService } from '../shared/services/user.service';
import { Storage } from '@ionic/storage';
import { User } from '../shared/models/user.model';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { RequestItem } from '../shared/models/request.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit, OnDestroy {

  profile:User;
  isLoading = true;
  userDataSubsription:Subscription;
  requestsList:RequestItem[];

 constructor(private modalController:ModalController, private userService:UserService, private storage:Storage, private router: Router) { }

 async ngOnInit() {

   let profile:User = await this.storage.get('Profile')
  
   this.userDataSubsription= this.userService.streamUserDataFromFireStore(profile.uid).subscribe(user =>{
     this.profile = user;      
     
   

     if(!this.profile.completedRequests){
       this.isLoading =false;
       return;}   

     

     for(let i=0; i< this.profile.completedRequests.length; i++){
       let requestItem = this.profile.completedRequests[i];
       
       console.log(requestItem.completedDate)
         requestItem.completedDate = new firebase.firestore.Timestamp(requestItem.completedDate.seconds, requestItem.completedDate.nanoseconds).toDate()  
         console.log(requestItem.completedDate)

       if(!requestItem.status)
         requestItem.status = 'Pending';      
     }

     this.requestsList = this.profile.completedRequests.filter((request)=>{

      
      return this.profile.uid == request.acceptedByUid})
     this.isLoading = false;
   })  
 }

 ionViewWillLeave(){
  if(this.userDataSubsription != null){
    this.userDataSubsription.unsubscribe();
   }     
 }


 ngOnDestroy(){
  console.log("history destroyed");
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


 segmentChanged(event){

  this.isLoading = true;
  console.log(event.detail.value);

  console.log(this.profile.completedRequests);
  

  if(!this.profile.requests){

  } else{

    if(event.detail.value == 'you'){

      this.requestsList = this.profile.completedRequests.filter((request)=>{

      
        return this.profile.uid == request.acceptedByUid})
  
    }else{

      this.requestsList = this.profile.completedRequests.filter((request)=>{

      
        return this.profile.uid == request.createdByUid})

    }

    this.isLoading = false;
    }

      


  }


  onClickRequest(i:number){
    this.router.navigate(['/history/history-detail',this.profile.completedRequests.indexOf(this.requestsList[i])])
    
  }

  
  
}




