import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
import { User } from '../shared/models/user.model';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { AngularFireStorage } from '@angular/fire/storage';
import { ActionSheetController } from '@ionic/angular';
import { take, finalize } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { PlaceLocation } from '../shared/models/location.model';
import { AuthService } from '../auth/auth.service';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profile:User;
  age:number=-1;
  isUploading:boolean = false;
  isMyProfile:boolean = false;

  constructor(private userService:UserService,
              private storage:Storage, 
              private camera:Camera,
              private crop:Crop,
              private angularFireStorage:AngularFireStorage,
              private actionSheetController:ActionSheetController,
              private activatedRoute:ActivatedRoute,
              private authService:AuthService) { }

  

  async ngOnInit() {
    let uid = this.activatedRoute.snapshot.paramMap.get('uid');
    if(uid == 'me'){
      let storedProfile:User = await this.storage.get('Profile');
      uid = storedProfile.uid;
      this.isMyProfile = true;
    }
      
    this.userService.getUserDataFromFireStore(uid).subscribe((user)=> {
      this.profile = user; 
      this.age = this.calculateAge(new Date(this.profile.dateOfBirth));

      console.log("PHOTOTURL",this.profile.photoURL)
      
      if(!this.profile.photoURL){
        if(this.profile.gender == 'Male'){
                      
          this.profile.photoURL = '/assets/avatars/male-avatar.png'
        } else{
          this.profile.photoURL = '/assets/avatars/female-avatar.png'
        }
      }
    })
    
  }

  async onUploadPhoto(){
    if(this.isMyProfile)
     await this.presentActionSheet()

  
  }

   async uploadToFireStorage(url){
     this.isUploading = true;
    const path = 'avatar-'+ this.profile.username;
    const blob = await fetch(url).then(r => r.blob());
    
    const fileRef = this.angularFireStorage.ref(path);
    console.log('imsgeURL',url)
    console.log('fileRef', fileRef)

    const ref = this.angularFireStorage.ref(path);
    const uploadTask = ref.put(blob);
    // let uploadTask = this.angularFireStorage.upload(path,blob);

    uploadTask.snapshotChanges().pipe(finalize(() => {
      
      fileRef.getDownloadURL().pipe(take(1)).subscribe(((downloadURL)=>{
        this.profile.photoURL = downloadURL;
        
        this.userService.updateUserDataToFireStore(this.profile).then(()=>{
          this.authService.changeProfile(this.profile).subscribe(()=>{console.log('sent');});
          this.isUploading = false})}))
    }))
  .subscribe()
}

  async onCamera(){

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI
    }
      // let myphoto = imageData;
      // var blob = base64ToBlob(myphoto, 'image/png');
      // var url = URL.createObjectURL(blob);
      // console.log("myphoto", url)
      // this.selectedPhoto = url;

    let imageData = await this.camera.getPicture(options)
    let newImage = await this.crop.crop(imageData, {quality: 75})

    let win: any = window;
    let safeImageURL = win.Ionic.WebView.convertFileSrc(newImage);//
    console.log("safeImageURL", safeImageURL)
    return safeImageURL     
  }

  async getImageFromGallery() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    
    let imageData = await this.camera.getPicture(options)
    let newImage = await this.crop.crop(imageData, {quality: 100})

    let win: any = window;
    let safeImageURL = win.Ionic.WebView.convertFileSrc(newImage);
    console.log("safeImageURL", safeImageURL)
    return safeImageURL 
       
  }

   calculateAge(birth:Date) {
 
    var today = new Date();
    var nowyear = today.getFullYear();
    var nowmonth = today.getMonth();
    var nowday = today.getDate();
 
    var birthyear = birth.getFullYear();
    var birthmonth = birth.getMonth();
    var birthday = birth.getDate();
 
    var age = nowyear - birthyear;
    var age_month = nowmonth - birthmonth;
    var age_day = nowday - birthday;
    
    if(age_month < 0 || (age_month == 0 && age_day <0)) {
            age = age -1;
        }
    return age;
    
    // if ((age == 18 && age_month <= 0 && age_day <=0) || age < 18) {
    // }
    // else {
    //     alert("You have crossed your 18th birthday !");
    // }
 
}


async presentActionSheet() {
  const actionSheet = await this.actionSheetController.create({
    header: 'Choose Image Source',
    cssClass: 'my-custom-class',
    buttons: [ {
      text: 'Camera',
      icon: 'caret-forward-circle',
      handler: () => {
        this.onCamera().then((imageURL)=>{this.uploadToFireStorage(imageURL)})
      }
    }, {
      text: 'Gallery',
      icon: 'image',
      handler: () => {
        this.getImageFromGallery().then((imageURL)=>{this.uploadToFireStorage(imageURL)})
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    }]
  });
  await actionSheet.present();
}

async onLocationPick(location: PlaceLocation){ 

  
  let profile:User = await this.storage.get('Profile')
  profile.placeLocation = location
  await this.userService.updateUserDataToFireStore(profile)
  this.authService.changeProfile(this.profile).subscribe(()=>{console.log('sent');});
  

}

  

}
