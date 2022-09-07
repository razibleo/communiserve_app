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
  selector: 'app-your-requests',
  templateUrl: './your-requests.page.html',
  styleUrls: ['./your-requests.page.scss'],
})
export class YourRequestsPage implements OnInit, OnDestroy {

   profile:User;
   isLoading = true;
   userDataSubsription:Subscription;
   requestsList:RequestItem[];
   isRequestsEmpty:boolean= false;

  constructor(private modalController:ModalController, private userService:UserService, private storage:Storage,private router:Router) { }

  

   ngOnInit() {

  }

  async ionViewDidEnter(){
    this.isLoading = true;
    console.log("your requests");
    let profile:User = await this.storage.get('Profile')
   
    this.userDataSubsription= this.userService.streamUserDataFromFireStore(profile.uid).subscribe(user =>{
      this.profile = user;      

      if(!this.profile.requests){
        this.isLoading =false;
        return;}   

      for(let i=0; i< this.profile.requests.length; i++){
        let requestItem = this.profile.requests[i];
                
          requestItem.submittedDate = new firebase.firestore.Timestamp(requestItem.submittedDate.seconds, requestItem.submittedDate.nanoseconds).toDate()  

        if(!requestItem.status)
          requestItem.status = 'Pending';      
      }
      this.requestsList = this.profile.requests.filter((request)=>{return request.status == 'Pending'})
      this.isLoading = false;
    })  
    
  }

  addRequest(){
    this.modalController.create({ component: AddRequestModalComponent}).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {           
      });
      modalEl.present();
    })   
    
    
  }

  ionViewWillLeave(){
    console.log('will leave');
    
    if(this.userDataSubsription != null){
      this.userDataSubsription.unsubscribe();
     }     
   }

  

  ngOnDestroy(){
    console.log("your-requests destroyed");
    if(this.userDataSubsription != null){
      this.userDataSubsription.unsubscribe();
     }     
  }

  segmentChanged(event){
    console.log(event.detail.value);
    
    if(!this.profile.requests){
      this.isRequestsEmpty = true;      
    }else{
      this.isRequestsEmpty = false;
      this.requestsList = this.profile.requests.filter((request)=>{
        console.log(request.status);
        
        return request.status == event.detail.value})

    }
    
  }

  onClickRequest(i:number){
    this.router.navigate(['/your-requests/your-requests-detail',this.profile.requests.indexOf(this.requestsList[i])])
   
    
   
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
