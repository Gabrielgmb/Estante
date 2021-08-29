import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
import { User } from '../model/user.model';
import { Router } from "@angular/router";
import { UtilService } from 'src/app/services/util.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  userData:any;
  
  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,  
    public ngZone: NgZone,
    private util: UtilService,
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
   }

  public getAllShelf() {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('shelf').get().subscribe((shelf) => {
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

  // Login in with email/password
  public SignIn(login) {
    return new Promise<any>((resolve, reject) => {
      this.ngFireAuth.signInWithEmailAndPassword(login.email, login.password).then(res => {
        localStorage.setItem('uid', res.user.uid);
        this.router.navigate(['/tabs']);
      })
      .catch(err => {
        this.util.showToast(`Email ou senha incorretos`, 'danger', 'bottom');
      });
    });
  }

  // Register user with email/password
  public RegisterUser(register) {
    return new Promise<any>((resolve, reject) => {
      this.ngFireAuth.createUserWithEmailAndPassword(register.email, register.password).then(res => {
        this.afStore.collection('users').doc(res.user.uid).set({
          address:register.address,
          email: register.email,
          fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : '',
          name: register.name,
          phone: register.phone,
          uid: res.user.uid
        }).catch(err => {
          reject(`erro ao registrar`)
        });
        resolve(res.user.uid);
      }).catch(err => {
        reject(`erro ao registrar`)
      });
    });
  }


  // Returns true when user is looged in
  isLoggedIn(){
    const uid = localStorage.getItem('uid');
    return (uid !== null && uid) ? true : false;
  }

  // Sign-out 
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    })
  }
}
