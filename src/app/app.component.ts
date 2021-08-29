import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private api: ApiService,
    private navCtrl: NavController,
  ) {
    console.log(localStorage.getItem('uid'))
    if(!this.api.isLoggedIn()){
      this.navCtrl.navigateRoot('/login');
    }
  }

}
