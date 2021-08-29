import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private api: ApiService,
    private navCtrl: NavController,
  ) {
    if(!this.api.isLoggedIn()){
      this.navCtrl.navigateRoot('/login');
    }
  }

}
