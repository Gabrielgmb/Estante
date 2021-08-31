import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth} from '@angular/fire/auth';
import { AngularFirestore,AngularFirestoreDocument  } from '@angular/fire/firestore';
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

  public getProfile() {
    const uid = localStorage.getItem('uid');
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('users').doc(uid).get().subscribe((user: any) =>  {
          resolve(user.data());
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
          cover:'',
          address:register.address,
          email: register.email,
          fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : '',
          name: register.name,
          phone: register.phone,
          uid: res.user.uid
        }).catch(err => {
          reject(`erro ao registrar`)
        });
        localStorage.setItem('uid', res.user.uid);
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
  public SignOut() {
    this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('uid');
      this.router.navigate(['login']);
    })
  }

  public updateProfile(uid, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('users').doc(uid).update(param).then((data) => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public getCategories() {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('categories').get().subscribe((cat) => {
          let data = cat.docs.map((element:any) => {
            let item = element.data();
            return item;
          });
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  public getBookById(uid,id): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this.afStore.collection('books').doc(uid).collection('all').doc(id).get().subscribe(async (order: any) => {
        let data = await order.data();
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public addBook(uid, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('books').doc(uid).collection('all').doc(param.id).set(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public updateBook(uid, param): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('books').doc(uid).collection('all').doc(param.id).update(param).then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public deleteBook(uid, id): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.afStore.collection('books').doc(uid).collection('all').doc(id).delete().then((data) => {
        resolve(data);
      }, error => {
        reject(error);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public listenBooks(id: string) {
    return this.afStore.collection('books').doc(id).collection('all').stateChanges();
  }
}
