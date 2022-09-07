import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/shared/models/user.model';
import { RequestItem } from 'src/app/shared/models/request.model';
import * as firebase from 'firebase';


@Component({
  selector: 'app-active-requests-detail',
  templateUrl: './active-requests-detail.page.html',
  styleUrls: ['./active-requests-detail.page.scss'],
})
export class ActiveRequestsDetailPage implements OnInit {
  requestItem:RequestItem;
  requestNumber:number;
  profile:User;
  isLoading:boolean = true;

  constructor(private activatedRoute:ActivatedRoute, private userService:UserService, private storage:Storage, private router:Router) {
   }

  async ngOnInit() {
    this.requestNumber = +this.activatedRoute.snapshot.paramMap.get('requestNumber');

    let profile:User = await this.storage.get('Profile')
    this.userService.getUserDataFromFireStore(profile.uid).subscribe(user =>{
      this.profile = user;
      this.requestItem = this.profile.activeRequests[this.requestNumber];   
      this.requestItem.submittedDate = new firebase.firestore.Timestamp(this.requestItem.submittedDate.seconds, this.requestItem.submittedDate.nanoseconds).toDate();
      this.requestItem.acceptedDate = new firebase.firestore.Timestamp(this.requestItem.acceptedDate.seconds, this.requestItem.acceptedDate.nanoseconds).toDate()     

      if(!this.requestItem.status)
        this.requestItem.status = 'Pending';

      this.isLoading = false;
    })  
  }


  // async onDeleteRequest(){
  //   this.profile.requests.splice(this.requestNumber,1);
  //   console.log(this.profile.requests);
    
  //   await this.userService.updateUserDataToFireStore(this.profile)
  //   this.router.navigate(['/active-requests'])

  // }
  
}





  



