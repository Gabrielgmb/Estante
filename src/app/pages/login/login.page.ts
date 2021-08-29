import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login = { email: '', password: '' };
  submitted = false;
  isLogin: boolean = false;
  pwReavel: any = 0;
  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,

  ) {
  }

  ngOnInit() {
    if(this.api.isLoggedIn()){
      this.router.navigate(['/tabs']);
    }
  }

  onLogin(form: NgForm) {
    this.submitted = true;
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast('Please enter valid email', 'danger', 'bottom');
        return false;
      }
      this.api.SignIn(this.login)
    }
  }

  changePassword(state){
    this.pwReavel=state;
    document.getElementById('password')
  }

  register() {
    this.router.navigate(['register']);
  }

}
