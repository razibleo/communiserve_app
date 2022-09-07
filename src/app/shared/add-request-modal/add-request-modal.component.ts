import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { ShoppingItem } from '../models/shopping-item.model';
import { UserService } from '../services/user.service';
import { Storage } from '@ionic/storage';
import { User } from '../models/user.model';
import {RequestItem} from '../models/request.model'
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-request-modal',
  templateUrl: './add-request-modal.component.html',
  styleUrls: ['./add-request-modal.component.scss'],
})
export class AddRequestModalComponent implements OnInit {

  quantity:number = 1;
  itemId = 0;
  shoppingList:ShoppingItem[]=[];

  constructor(private modalController:ModalController, private userService:UserService, private storage:Storage, private loadingController:LoadingController,private router:Router) { }

  ngOnInit() {}

  onCancel(){
    this.modalController.dismiss();
  }

  async onAddRequest(){

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
    });

    await loading.present();

    let requestItem:RequestItem = {submittedDate: new Date(), shoppingList: this.shoppingList, status: 'Pending'}
    let profile:User = await this.storage.get('Profile');
    this.userService.getUserDataFromFireStore(profile.uid).subscribe(data=>{
      profile = data;

            
      if(!profile.requests){
        profile.requests = []
      } 
        profile.requests.push(requestItem);
        this.userService.updateUserDataToFireStore(profile).then(()=>{
          this.shoppingList = []
          loading.dismiss()
          this.router.navigate(['/your-requests'])
          this.modalController.dismiss()
        })
        
      })
    }
  

  addItem(shoppingForm:NgForm){
    console.log(shoppingForm.form.value)
    let form = shoppingForm.form.value;
    this.itemId +=1;
    let shoppingItem = {id: this.itemId, name: form.name, importance:form.importance, quantity:this.quantity}
    this.shoppingList.push(shoppingItem);
    shoppingForm.reset();
    
  }

  onDeleteItem(shoppingItem:ShoppingItem){
    this.shoppingList = this.shoppingList.filter(item =>{return item.id != shoppingItem.id});
   
  }


  increment(){
    if(this.quantity >= 99){
      return;
    }

    this.quantity += 1;

  }
  decrement(){
    if(this.quantity <= 1){
      return;
    }

    this.quantity -= 1;
  }



}
