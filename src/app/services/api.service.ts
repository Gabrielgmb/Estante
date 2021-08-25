import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../model/user.model';
export class AuthInfo {


  constructor(public $uid: string) {

  }

  isLoggedIn() {
    return !!this.$uid;
  }
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static UNKNOWN_USER = new AuthInfo(null);
  private authSubject: Subject<any>;
  public authInfo$: BehaviorSubject<AuthInfo> = new BehaviorSubject<AuthInfo>(ApiService.UNKNOWN_USER);
  constructor(
    private fireAuth: AngularFireAuth,
    private adb: AngularFirestore,
  ) { }

  public getAllShelf() {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('shelf').get().subscribe((shelf) => {
          let data = shelf.docs.map((element:any) => {
            let item = element.data();
            item.id = element.id;
            return item;
          });
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  public checkAuth() {
    return new Promise((resolve, reject) => {
      this.fireAuth.onAuthStateChanged(userSnapshot => {
        if (userSnapshot) {
          localStorage.setItem('uid', userSnapshot.uid);

          let user: User = new User();
          this.getMyProfile(userSnapshot.uid).then(async (data: any) => {
            if (data) {
              user.jwtToken = (await userSnapshot.getIdTokenResult()).token;
              user.coverImage = data.coverImage;
              user.email = data.email;
              user.name = data.name;
              user.phone = data.phone;
              user.uid = data.uid
              localStorage.setItem('userInfo', JSON.stringify(user));
            }
          }).catch(error => {
          }).finally(() => {
            resolve(user);
          });
        } else {
          this.logout();
          resolve(false);
        }
      });
    });
  }

  public getMyProfile(id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.adb.collection('users').doc(id).get().subscribe((users: any) => {
        resolve(users.data());
      }, error => {
        reject(error);
      });
    });
  }


  public register(register): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(register.email, register.password)
        .then(res => {
          if (res.user) {
            this.adb.collection('users').doc(res.user.uid).set({
              email: register.email,
              name: register.name,
              phone: register.phone,
              uid: res.user.uid,
            });
            this.authInfo$.next(new AuthInfo(res.user.uid));
            resolve(res.user);
          }
        })
        .catch(err => {
          this.authInfo$.next(ApiService.UNKNOWN_USER);
          reject(`login failed ${err}`)
        });
    });
  }

  public logout(): Promise<void> {
    this.authInfo$.next(ApiService.UNKNOWN_USER);
    // this.db.collection('users').doc(localStorage.getItem('uid')).update({ "fcm_token": firebase.firestore.FieldValue.delete() })
    return this.fireAuth.signOut();
  }
}
