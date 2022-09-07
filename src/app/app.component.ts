import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from './shared/services/user.service';
import { User } from './shared/models/user.model';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  profile:User;
  profileSubscription:Subscription;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService:AuthService,
    private router:Router,
    private userService:UserService
  ) {
    this.initializeApp();
  }
  

  initializeApp() {
    this.platform.ready().then(() => {

      

      // console.log("ipad",this.platform.is('ipad'))
      // console.log("iphone",this.platform.is('iphone'))
      // console.log("ios",this.platform.is('ios'))
      // console.log("android",this.platform.is('android'))
      // console.log("phablet",this.platform.is('phablet'))
      // console.log("tablet",this.platform.is('tablet'))
      // console.log("cordova",this.platform.is('cordova'))
      // console.log("capacitor",this.platform.is('capacitor'))
      // console.log("electron",this.platform.is('electron'))
      // console.log("pwa",this.platform.is('pwa'))
      // console.log("mobile",this.platform.is('mobile'))
      // console.log("mobileweb",this.platform.is('mobileweb')) 
      // console.log("desktop",this.platform.is('desktop'))
      // console.log("hybrid",this.platform.is('hybrid'))


      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.statusBar.hide();
      // this.statusBar.overlaysWebView(false);
    });

    this.authService.profileToken.subscribe((profile)=>{
      this.profile = profile;
      console.log("Menu Proile", profile);
      // if(!this.profileSubscription && this.profile){
      //   this.profileSubscription= this.userService.streamUserDataFromFireStore(this.profile.uid).subscribe((userData)=>{this.authService.changeProfile(userData).subscribe(()=>{console.log('POINTS');
      //   })})
      // }

      
    })    
  }

  onClickProfile(){
    this.router.navigate(['/profile/me'])
  }
  
  onClickHome(){
    this.router.navigate(['/community-requests/home'],{ replaceUrl: true });
  }
  onClickActiveRequests(){
    this.router.navigate(['/active-requests'],{ replaceUrl: true });
  }
  onClickYourRequests(){
    this.router.navigate(['/your-requests'],{ replaceUrl: true });
  }
  onClickHistory(){
    this.router.navigate(['/history'],{ replaceUrl: true });
  }
  onClickLeaderboards(){
    this.router.navigate(['/leaderboards'],{ replaceUrl: true });
  }

  onClickRewards(){

    
    this.router.navigate(['/rewards'],{ replaceUrl: true });
    
  }


   


  onLogout(){
    if(this.profileSubscription){
      this.profileSubscription.unsubscribe();
    }
    this.authService.signOut();
  }
}
