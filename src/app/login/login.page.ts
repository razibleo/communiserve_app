import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LoadingController, Platform } from '@ionic/angular';
import { UserService } from '../shared/services/user.service';





@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signInErrorMessage:string;
  isAndroid:boolean = false;

  constructor(private authService:AuthService, private router:Router,private storage:Storage, private loadingController:LoadingController, private userService:UserService,private platform: Platform) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    await this.storage.remove('Profile');

    if(this.platform.is('android') && this.platform.is('hybrid')){
      console.log('ANDROIDDDDDDDDDDDDDDDdd');
      this.isAndroid= true;
    }
  }

  async onSignIn(loginForm:NgForm){
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Logging in...'
    });

    await loading.present();

    let form = loginForm.form.value;

    let credential;

    this.authService.signIn(form.email, form.password).then((userCredential)=>{
      
      let data = {uid: userCredential.user.uid}
      this.storage.set('Profile',data)
      loading.dismiss()
      this.router.navigate(['community-requests/home'],{ replaceUrl: true })
    }).catch((error)=>{
      if(error.code == "auth/user-not-found"){
        this.signInErrorMessage = "There is no account that associated with the entered email address"

      } else if(error.code == "auth/wrong-password"){
        this.signInErrorMessage = "Incorrect Password Entered"
      } else{
        console.log("Sign in error", error)
      }
      loading.dismiss()
    })

    // this.authService.signIn(form.email, form.password);
  }

  async googleSignin(loginForm:NgForm){


    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Logging in...'
    });

    await loading.present();

    if(this.platform.is('android') && this.platform.is('hybrid')){
      console.log('ANDROIDDDDDDDDDDDDDDDdd')
      

    //   this.authService.googleSignInMobile().then((credential:firebase.auth.UserCredential)=>{

    //     console.log("credential", credential);
      
    //   let data = {uid: credential.user.uid};

    //   this.storage.set('Profile', data).then(()=>{

    //     this.userService.getUserDataFromFireStore(credential.user.uid).subscribe((userData)=>{

    //       if(userData){
    //         console.log("YES");
    
    //         this.storage.set('Profile', userData).then(()=>{
    //           console.log("profile saved");

    //           this.storage.get('Profile').then((data)=>{console.log(data);
    //           })
              
    //           loading.dismiss();
    //           console.log('Loading dismissed!');
             
    //           this.router.navigate(['/community-requests/home']);
    //           console.log('home');
    //         })
           
    //       } else{
    
    //         console.log("NO");
    //         this.signInErrorMessage="There is no account that associated with the entered email address";
    //         let data = {
    //           uid: credential.user.uid,
    //           username: credential.user.displayName,
    //           email: credential.user.email,
    //           photoURL: credential.user.photoURL
    //         }
    //         this.storage.set('Profile', data).then(()=>{
    //           loading.dismiss();
    //           console.log('Loading dismissed!');
    //           this.router.navigate(['/signup/first']);              
    //         })
            
    //       }
    
    //     })
    //   })      
    
    // }).catch((error)=>{
      
    //   loading.dismiss();
    
    //   })

    } else{

      this.authService.googleSignIn().then((credential:firebase.auth.UserCredential)=>{

        

        console.log("credential", credential);
        
        let data = {uid: credential.user.uid};
  
        this.storage.set('Profile', data).then(()=>{
  
          this.userService.getUserDataFromFireStore(credential.user.uid).subscribe((userData)=>{
  
            if(userData){
              console.log("YES");
      
              this.storage.set('Profile', userData).then(()=>{
                console.log("profile saved");
  
                this.storage.get('Profile').then((data)=>{console.log(data);
                })
                
                loading.dismiss();
                console.log('Loading dismissed!');
               
                this.router.navigate(['/community-requests/home']);
                console.log('home');
              })
             
            } else{
      
              console.log("NO");
              this.signInErrorMessage="There is no account that associated with the entered email address";
              let data = {
                uid: credential.user.uid,
                username: credential.user.displayName,
                email: credential.user.email,
                photoURL: credential.user.photoURL
              }
              this.storage.set('Profile', data).then(()=>{
                loading.dismiss();
                console.log('Loading dismissed!');
                this.router.navigate(['/signup/first']);              
              })
              
            }
      
          })
        })      
      
      }).catch((error)=>{
        
        loading.dismiss();
      })
      
    }
  

    // this.authService.googleSignin();


    // this.storage.get('profile').then((data)=>console.log('stored data',data))
 

    
    // this.authService.googleSignin().then((data)=>{
    //   this.storage.set('name', 'Max').then(()=>{
    //     this.router.navigate(['/community-requests/home'])
    //   })
    //   ;})
  }
  

  signOut(){
    this.authService.signOut();
    
  }

  onSignUp(){
    
    // this.router.navigate(['community-requests/signup/first']);
  }

  isRegistered():Boolean{
    return this.authService.getUserFound();
  }

}
