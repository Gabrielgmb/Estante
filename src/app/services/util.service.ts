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
  
  makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public formatPrice(value: number) {
    let formatedPrice = value.toFixed(2).replace('.', ',');
    return formatedPrice;
  }
}
