import { Component, OnInit, ElementRef, ViewChild,OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-first',
  templateUrl: './first.page.html',
  styleUrls: ['./first.page.scss'],
})
export class FirstPage implements OnInit, OnDestroy {
  @ViewChild('emailInput', { read: ElementRef }) emailElementRef: ElementRef;
  @ViewChild('usernameInput', { read: ElementRef }) usernameElementRef: ElementRef;

  someLink:string="second"
  maxDate:Date;
  passValid:boolean = true;
  emailCheckSubscription:Subscription;
  usernameCheckSubscription:Subscription;

  isEmailChecking:boolean = false;
  isEmailValid:boolean = false;

  isUsernameChecking:boolean = true;
  isUsernameValid:boolean = true;

  googleUserInfo:User;
  
  

  constructor(private storage:Storage,
     private router:Router, 
     private authService:AuthService, 
     private userService:UserService,
     private loadingController:LoadingController ) {}

  ngOnInit() {
    this.getMaxDate();
   
  }

  getMaxDate(){
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() -10);
  }

  async onSubmit(registrationForm:NgForm){

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...'
    });

    await loading.present();
    
    let form = registrationForm.form.value;
    let data ={
      email:form.email,
      username: form.username, 
      firstName: form.firstName,
      gender: form.gender,
      middleName: form.middleName,
      lastName: form.lastName,
      dateOfBirth: form.dob      
    }

    console.log(data); 

    this.storage.set('Profile',data).then(()=>{

      if(this.googleUserInfo){

        this.saveGoogleInfo(data)
        .then(()=>{
          loading.dismiss();
          this.router.navigate(['/signup/second']);
        });
        

      }else{

        this.authService.signUp(form.email, form.password)
        .then(()=>{
          loading.dismiss();
          this.router.navigate(['/signup/second']);
        });
      }

      
      // this.router.navigate(['/signup/second'])
    }) 
  }

  comparePassword(enteredPass:string, confirmPass:string){
    if (enteredPass == confirmPass){
      this.passValid = true;

    } else {
      this.passValid= false;

    }
  }

  saveGoogleInfo(data){
    let googleCredentital = {uid: this.googleUserInfo.uid, photoURL: this.googleUserInfo.photoURL};
    return this.storage.set('Profile',{...googleCredentital, ...data});
  }

  async ionViewDidEnter(){

    const emailEl= this.emailElementRef.nativeElement
    const usernameEl= this.usernameElementRef.nativeElement 


    this.emailCheckSubscription= fromEvent(emailEl,'input')
    .pipe(tap(()=>{this.isEmailChecking = true}), debounceTime(1000), switchMap((val)=>{return this.userService.getUsers()}))
    .subscribe((documents)=>{
      for (let index in documents){
        console.log('email',documents[index].email );
        
        if(documents[index].email == emailEl.value){
          this.isEmailChecking =false;
          this.isEmailValid =false;
          return true   
        }
      }
      this.isEmailChecking =false;      
      this.isEmailValid =true;
     
    })


    
    this.usernameCheckSubscription= fromEvent(usernameEl,'input')
    .pipe(tap(()=>{this.isUsernameChecking = true}), debounceTime(1000), switchMap((val)=>{return this.userService.getUsers()}))
    .subscribe((documents:User[])=>{
      for (let index in documents){
        console.log('username',documents[index]);
        console.log('username',documents[index].username );
        
        if(documents[index].username == usernameEl.value){
          this.isUsernameChecking =false;
          this.isUsernameValid =false;
          return true   
        }
      }
      this.isUsernameChecking =false;      
      this.isUsernameValid =true;
     
    })

    try{this.googleUserInfo = await this.storage.get('Profile');
        emailEl.value = this.googleUserInfo.email;
        usernameEl.value = this.googleUserInfo.username;

        emailEl.dispatchEvent(new Event("input"));
        usernameEl.dispatchEvent(new Event("input"));

        if(this.googleUserInfo){
          emailEl.disabled = true;
          usernameEl.disabled = true;
          
        }

      }catch(err){console.log("Non-Google Sign Up");}

  }

  ngOnDestroy(){
    if(this.emailCheckSubscription)
        this.emailCheckSubscription.unsubscribe()    

    if (this.usernameCheckSubscription)
        this.usernameCheckSubscription.unsubscribe();    
  }

}
