import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { take, map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private afs:AngularFirestore) { }

  getUsers(){
    return this.afs.collection<User>('users').snapshotChanges().pipe(take(1),map(actions => actions.map(a => {
       const data = a.payload.doc.data();
       return data;
     })))
  }

  streamUsers(){
    return this.afs.collection<User>('users').snapshotChanges().pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      return data;
    })))
  }
  

  getUserDataFromFireStore(uid:String) {
    return this.afs.doc<User>('users/'+ uid).valueChanges().pipe(take(1));
  }

  streamUserDataFromFireStore(uid:String) {
    return this.afs.doc<User>('users/'+ uid).valueChanges();
  }

  updateUserDataToFireStore(user:User):Promise<any> {
    return this.afs.doc<User>(`users/${user.uid}`).set(user, { merge: true })
  }

}
