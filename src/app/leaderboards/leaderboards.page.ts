import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-leaderboards',
  templateUrl: './leaderboards.page.html',
  styleUrls: ['./leaderboards.page.scss'],
})
export class LeaderboardsPage implements OnInit {

  isLoading:boolean = true;
  userList:User[];

  constructor(private userService:UserService) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
   
    this.userService.getUsers().subscribe(users=>{
      this.isLoading = true;
      this.userList=users;

      let max:number;

      if(this.userList.length>50){
        max = 50;
      } else{
        max = this.userList.length;
      }

      this.userList.sort((a:User,b:User)=>{
        if(!a.points)
          a.points = 0;

        if(!b.points)
          b.points = 0;
          
        if(a.points<b.points){
          return 1;
        } else{
          return -1;
        }
      })

      this.userList = this.userList.splice(0, max)
      this.isLoading = false;      
      console.log(this.userList)

      
    })
    
  }

  getCompletedRequestsByUser(user:User){
    if(!user.completedRequests){return 0}

    return user.completedRequests.filter((data)=>{return user.uid == data.acceptedByUid}).length;
  }

}
