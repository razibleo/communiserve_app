import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/shared/models/user.model';
import { RequestItem } from 'src/app/shared/models/request.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
})
export class HistoryDetailPage implements OnInit {

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
      this.requestItem = this.profile.completedRequests[this.requestNumber];    
     
      this.requestItem.submittedDate = new firebase.firestore.Timestamp(this.requestItem.submittedDate.seconds, this.requestItem.submittedDate.nanoseconds).toDate();

      if(this.requestItem.acceptedDate)
        this.requestItem.acceptedDate = new firebase.firestore.Timestamp(this.requestItem.acceptedDate.seconds, this.requestItem.acceptedDate.nanoseconds).toDate()  

      if(!this.requestItem.status)
        this.requestItem.status = 'Pending';

        this.requestItem.completedDate = new firebase.firestore.Timestamp(this.requestItem.completedDate.seconds, this.requestItem.completedDate.nanoseconds).toDate();  

      this.isLoading = false;
    })  
  }


  async onDeleteRequest(){
    this.profile.requests.splice(this.requestNumber,1);
    console.log(this.profile.requests);
    
    await this.userService.updateUserDataToFireStore(this.profile)
    this.router.navigate(['/your-requests'])

  }

}



