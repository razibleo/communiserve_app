import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { RequestItem } from '../models/request.model';
import { Storage } from '@ionic/storage';
import { UserService } from '../services/user.service';
import * as firebase from 'firebase';


@Component({
  selector: 'app-request-modal',
  templateUrl: './request-modal.component.html',
  styleUrls: ['./request-modal.component.scss'],
})
export class RequestModalComponent implements OnInit {
  @Input() user:User;
  isLoading:boolean = true;
  requestItem:RequestItem;
  requestNumber:number;
  profile:User;
  acceptedByUser:User;
  
  constructor(private modalController:ModalController, private router:Router, private storage:Storage, private userService:UserService) { }

  async ngOnInit() {
    
    if (!this.user.requests){
      this.isLoading = false;
      return
    }

    this.profile = await this.storage.get('Profile');
     
        

    for(let i=0; i< this.user.requests.length; i++){
      let requestItem = this.user.requests[i];
      console.log(requestItem.submittedDate)
      if(requestItem.submittedDate instanceof Date){
        continue
      }else{
      requestItem.submittedDate = new firebase.firestore.Timestamp(requestItem.submittedDate.seconds, requestItem.submittedDate.nanoseconds).toDate();
        
      }

      console.log(requestItem.submittedDate)

         

      if(!requestItem.status)
        requestItem.status = 'Pending';      
    }

    if(!this.user.photoURL){
      if(this.user.gender == 'Male'){
                    
        this.user.photoURL = '/assets/avatars/male-avatar.png'
      } else{
        this.user.photoURL = '/assets/avatars/female-avatar.png'
      }
    }
    this.isLoading = false;
    

   
  
    
  }

  onProfileClick(){
    this.modalController.dismiss();
    this.router.navigate(['/profile',this.user.uid])    
  }

  onClickRequest(index){
    console.log("Card");
    this.requestItem = this.user.requests[index];
    this.requestNumber = index +1;

  }

  onBack(){
    this.requestItem = null;

  }

  isRequestItemAcceptedbyMe(uid:string):boolean{
 
    
    if(uid == this.profile.uid){
      return true;
    } else{
      return false;
    }

  }

  

  async onAcceptRequest(event:Event, index?){
    event.stopPropagation();
    this.requestItem = this.user.requests[index];
    this.requestItem.status = 'Accepted'
    this.requestItem.createdByUid = this.user.uid;
    this.requestItem.createdByUserName = this.user.username;
    this.requestItem.acceptedByUid = this.profile.uid;
    this.requestItem.acceptedByUsername = this.profile.username;
    this.requestItem.acceptedDate = new Date();
    let currentRequest = this.requestItem
    this.requestItem = null;


    let data = {acceptedBy: this.profile.uid, acceptedDate: new Date()}
    let requestData:RequestItem = {...currentRequest,...data}
    
    if(!this.profile.activeRequests){this.profile.activeRequests = []}    


    this.profile.activeRequests.push(requestData)
    await this.userService.updateUserDataToFireStore(this.user)
    await this.userService.updateUserDataToFireStore(this.profile)
      

    console.log("Done");
  }




  onCancel(){
    this.modalController.dismiss();
  }

}
