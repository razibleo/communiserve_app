import { Injectable, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';


import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of, Subscription, BehaviorSubject } from 'rxjs';
import { switchMap, take, map, tap } from 'rxjs/operators';
import { User } from '../shared/models/user.model';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit, OnDestroy {

  private _profileToken:BehaviorSubject<User>= new BehaviorSubject<User>(null);


  private eventAuthError = new BehaviorSubject<string>("");
  eventAuthError$ = this.eventAuthError.asObservable();

  private user: Observable<User>;
  private authSubscription:Subscription;
  private profile:User;
  private userFound:Boolean = true;
  

  newUser: any;

  // getProfile(){return this.profile}
  get profileToken(){
    return this._profileToken.asObservable();
  }

  changeProfile(profile:User): Observable<User>{

    return this._profileToken.pipe(take(1), tap(profileData=>{
      this._profileToken.next(profile)
      console.log('next Called');
      
    }))
    // return this.financeList.pipe(take(1),tap(finances =>{
    //   this._financeList.next(finances.concat(newFinance))
    // }));
  };


  getUserFound():Boolean{  
    return this.userFound;
  }

  constructor(
      private afAuth: AngularFireAuth,
      private afs: AngularFirestore,
      private router: Router,
      private storage:Storage,
      private loadingController:LoadingController) {}

      ngOnInit(){
      //  this.authSubscription=  this.afAuth.authState.pipe(switchMap((user)=>{
          
      //     if (user) {
      //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
      //     } else {
      //       // Logged out
      //       return of(null);
      //     }
      //   })
      //   ).subscribe(data => console.log("authServiceNgOnit",data))
      }

      ngOnDestroy(){
        if(this.authSubscription){
          this.authSubscription.unsubscribe();
        }
      }


      async googleSignIn(){
        const provider = new auth.GoogleAuthProvider();
        return this.afAuth.signInWithPopup(provider);

      }

      async googleSignInMobile(){
        const provider = new auth.GoogleAuthProvider();
        return this.afAuth.signInWithRedirect(provider).then(()=>{
          return this.afAuth.getRedirectResult();
        });

      }
      

      // async googleSignin() {
      //   const provider = new auth.GoogleAuthProvider();
        
      //   const loading = await this.loadingController.create({
      //     cssClass: 'my-custom-class',
      //     message: 'Please wait...'
      //   });
      //   await loading.present();

      
      //   this.afAuth.signInWithPopup(provider)
      //   .then((userCredential)=>{
      //     this.getUserDataFromFireStore(userCredential.user).subscribe((userData)=>{
      //       console.log("userdata",userData);
                        
      //       if(userData){
      //         this.userFound= true;
      //         console.log("YES");

      //         this.storage.set('profile', userData).then(()=>{
      //           console.log("profile saved");
                
      //           loading.dismiss();
      //           console.log('Loading dismissed!');
      //           this.router.navigate(['/community-requests/home']);
      //         }).catch(()=>{loading.dismiss();
      //           console.log('Loading dismissed!');})
             
      //       } else{
      //         this.userFound = false;
      //         console.log("NO");
      //         loading.dismiss();
      //         console.log('Loading dismissed!');
      //       }
            
      //     }, error=>{
      //       loading.dismiss();
      //       console.log('Loading dismissed!');});
      //   }).catch(()=>{
      //     loading.dismiss();
      //       console.log('Loading dismissed!');
      //   })
      // }

      async signIn(email:string, password:string) {
        console.log("Signing In....")
        console.log("email:",email, "passsword: ", password)     
        const provider = new auth.EmailAuthProvider;
        return this.afAuth.signInWithEmailAndPassword(email, password)
      }


      getUserDataFromFireStore(user) {
        console.log("lflflgklgf,",user.uid);
        return this.afs.doc('users/'+ user.uid).valueChanges().pipe(take(1));
      
      }

      async signUp(email:string, password:string){
        console.log("Signing Up....")    
        const provider = new auth.EmailAuthProvider;
        const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        let uidCredential = credential.user.uid
        return this.storage.get('Profile').then((val)=>{

          let uidData={
            uid: uidCredential
          }

          return this.storage.set('Profile', {...uidData, ...val})          
        })
      }


      

          
    
       updateUserDataToFireStore(user):Promise<any> {
        console.log(user)

 

        // const data = { 
        //   uid: user.uid, 
        //   email: user.email, 
        //   displayName: user.displayName, 
        //   photoURL: user.photoURL
        // } 
        
    
        return this.afs.doc(`users/${user.uid}`).set(user, { merge: true })
              .then(()=>{this.profile = user})
      }

      createUser(user) {
        console.log(user);
        this.afAuth.createUserWithEmailAndPassword( user.email, user.password)
          .then( userCredential => {
            this.newUser = user;
            console.log(userCredential);
            userCredential.user.updateProfile({
              displayName: user.firstName + ' ' + user.lastName
            });
            this.updateUserDataToFireStore(userCredential);
          })
          .catch( error => {
            this.eventAuthError.next(error);
          });
      }
    
      async signOut() {
        const loading = await this.loadingController.create({
          cssClass: 'my-custom-class',
          message: 'Please wait...'
        });
        await loading.present();
        await this.storage.remove('Profile');
        await this.afAuth.signOut();
        loading.dismiss();
        this.changeProfile(null)
        this.router.navigate(['/login'],{ replaceUrl: true });
      }

      checkUsers(){
       return this.afs.collection<User>('users').snapshotChanges().pipe(take(1),map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          return data;
        })))
        }
        
}


