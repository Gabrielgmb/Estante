import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { User } from '../../model/user.model';
import { UtilService } from 'src/app/services/util.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  user:User;
  constructor(
    private api: ApiService,
    private navCtrl: NavController,
    private util: UtilService,
    private router: Router,
  ) { 
    
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    if(this.api.isLoggedIn()){
      this.getProfile();
    }else{
      this.navCtrl.navigateRoot('/login');
    }
  }

  getProfile() {
    this.api.getProfile().then((user) => {
      this.user=user;
      console.log(this.user)
    }).catch(err => {
      localStorage.removeItem('uid');
      this.util.showToast(`Algo de errado com sua conta`, 'danger', 'bottom');
    });
  }

  goToEditProfile() {
    this.router.navigate(['/edit-account']);
  }

  logout(){
    this.api.SignOut();
  }

}
