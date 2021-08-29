import { Injectable } from '@angular/core';
import { ToastController,LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  isLoading = false;
  constructor(
    private toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
  ) { }

  async showToast(msg, colors, positon) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 1000,
      color: colors,
      position: positon
    });
    toast.present();
  }

  async show(msg?) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg,
      spinner: 'crescent',
      cssClass: 'custom-loading'
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss();
        }
      });
    });
  }

  async hide() {
    if (this.isLoading) {
      this.isLoading = false;
      return await this.loadingCtrl.dismiss();
    }
  }
}
