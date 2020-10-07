import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';



export interface UserInfo{
  id: number;
  preName: string;
  amount: string;
  date: string;
  perDay: string;
  place: string;
}
@Injectable({
  providedIn: 'root'
})

export class UserInfoService {

  private userinfoCollection: AngularFirestoreCollection<UserInfo>;

  private Userinfo: Observable<UserInfo[]>;

  constructor(db: AngularFirestore){

    this.userinfoCollection = db.collection<UserInfo>('Userinfo');

    this.Userinfo = this.userinfoCollection.snapshotChanges().pipe(
      map(actions =>{
        return actions.map(a =>{
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getUserinfo(){
    return this.Userinfo;
  }

  getUserinfoId(id){
    return this.userinfoCollection.doc<UserInfo>(id).valueChanges();
  }

  updateUserinfo(userinfo: UserInfo, id: string){
    return this.userinfoCollection.doc(id).update(userinfo);
  }

  addUserinfo(userinfo: UserInfo){
    return this.userinfoCollection.add(userinfo);
  }

  removeUserinfo(id){
    return this.userinfoCollection.doc(id).delete();
  }
}
