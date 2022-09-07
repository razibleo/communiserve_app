import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { Storage } from '@ionic/storage';
import { User } from 'src/app/shared/models/user.model';
import { RequestItem } from 'src/app/shared/models/request.model';
import * as firebase from 'firebase';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-your-requests-detail',
  templateUrl: './your-requests-detail.page.html',
  styleUrls: ['./your-requests-detail.page.scss'],
})
export class YourRequestsDetailPage implements OnInit {
  requestItem:RequestItem;
  requestNumber:number;
  profile:User;
  isLoading:boolean = true;

  constructor(private activatedRoute:ActivatedRoute, private userService:UserService, private storage:Storage, private router:Router, private loadingController:LoadingController) {
   }

  async ngOnInit() {
    this.requestNumber = +this.activatedRoute.snapshot.paramMap.get('requestNumber');

    let profile:User = await this.storage.get('Profile')
    this.userService.getUserDataFromFireStore(profile.uid).subscribe(user =>{
      this.profile = user;
      this.requestItem = this.profile.requests[this.requestNumber];    
     
      this.requestItem.submittedDate = new firebase.firestore.Timestamp(this.requestItem.submittedDate.seconds, this.requestItem.submittedDate.nanoseconds).toDate();

      if(this.requestItem.acceptedDate)
        this.requestItem.acceptedDate = new firebase.firestore.Timestamp(this.requestItem.acceptedDate.seconds, this.requestItem.acceptedDate.nanoseconds).toDate()  

      if(!this.requestItem.status)
        this.requestItem.status = 'Pending';

      this.isLoading = false;
    })  
  }


  async onDeleteRequest(){
    this.profile.requests.splice(this.requestNumber,1);
    console.log(this.profile.requests);
    
    await this.userService.updateUserDataToFireStore(this.profile)
    this.router.navigate(['/your-requests'])

  }

  async onClickItemsReceived(){

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    let completedDate = new Date();
    let currentRequestItem = this.requestItem;
    this.profile.requests.splice(this.requestNumber,1)

    currentRequestItem.completedDate = completedDate;
    currentRequestItem.status ='Completed';

    if(!this.profile.completedRequests){
      this.profile.completedRequests =[];
    }

    this.profile.completedRequests.unshift(currentRequestItem)

    await this.userService.updateUserDataToFireStore(this.profile)

    let requestItemAcceptedDate = this.requestItem.acceptedDate.getTime();

    this.userService.getUserDataFromFireStore(currentRequestItem.acceptedByUid).subscribe((userData)=>{

      let user = userData;
      let updatedActiveRequests:RequestItem[]= user.activeRequests.filter((request)=>{
        let acceptedDate = new firebase.firestore.Timestamp(request.acceptedDate.seconds,request.acceptedDate.nanoseconds).toDate().getTime();
        console.log('requestItemAcceptedDate',requestItemAcceptedDate);
        console.log('acceptedDate',acceptedDate);
        return acceptedDate != requestItemAcceptedDate});

      let fulfilledRequestItem:RequestItem = user.activeRequests.find((request)=>{
        let acceptedDate = new firebase.firestore.Timestamp(request.acceptedDate.seconds,request.acceptedDate.nanoseconds).toDate().getTime();
        console.log('requestItemAcceptedDate',requestItemAcceptedDate);
        console.log('acceptedDate',acceptedDate);
        return acceptedDate == requestItemAcceptedDate});

      user.activeRequests = updatedActiveRequests;
      
      if(!user.completedRequests){user.completedRequests=[]}

      fulfilledRequestItem.completedDate = completedDate;
      fulfilledRequestItem.status ='Completed';
      fulfilledRequestItem.points = fulfilledRequestItem.shoppingList.length;
      
      if(user.points == null){user.points=0}

      user.points += fulfilledRequestItem.points;

      user.completedRequests.unshift(fulfilledRequestItem);
      
      console.log('sssssss',updatedActiveRequests);

      this.userService.updateUserDataToFireStore(user).then(()=>{
        loading.dismiss();
        this.router.navigate(['/your-requests'])})

           
      
    })
  }



  
}


