import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router } from "@angular/router";
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Book } from '../../model/book.model';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Dimensions, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.page.html',
  styleUrls: ['./add-book.page.scss'],
})
export class AddBookPage implements OnInit {
  Myimage =null;
  croppedImage = null;
  book:Book = {
    cover: '',
    cid: '',
    name:'',
    buy:0,
    sell:0,
    desc:'',
    id:'' };
  canvasRotation = 0;
  rotation = 0;
  transform: ImageTransform = {};

  @ViewChild(ImageCropperComponent, {static:false}) imageCropper: ImageCropperComponent;
  constructor(
    private api: ApiService,
    private util: UtilService,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private router: Router,
  ) {
  }

  
  ngOnInit() {

  }

  create() {
    if (this.book.name === '' || this.book.cover === '' || this.book.cid === '' || this.book.buy === 0 || this.book.sell === 0 || this.book.desc === '' ||
    !this.book.name ||!this.book.cover ||!this.book.cid ||!this.book.buy ||!this.book.sell ||!this.book.desc ) {
    this.util.showToast('Todos os campos são obrigatorios', 'danger', 'bottom');
    return false;
    }
    this.book.id = this.util.makeid(15);
    this.util.show();
    this.api.addBook(localStorage.getItem('uid'), this.book).then((data: any) => {
      this.util.hide();
      this.util.showToast('Livro adicionado com sucesso', 'success', 'bottom');
      this.router.navigate(['/tabs/tab1']);
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.showToast('Algo deu errado', 'danger', 'bottom');
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.showToast('Algo deu errado', 'danger', 'bottom');
    });
  }

  async cover() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Escolha quais',
      buttons: [{
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          this.opemCamera('camera');
        }
      }, {
        text: 'Galeria',
        icon: 'image',
        handler: () => {
          this.opemCamera('gallery');
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  opemCamera(type) {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 700,
      targetWidth: 700,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: type === 'camera' ? 1 : 0
    };
    this.camera.getPicture(options).then((imageData) => {
      this.Myimage = 'data:image/jpeg;base64,' + imageData;

    }, (err) => {
      this.util.hide();
    });
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  clearCropper(){
    this.imageCropper.imageBase64 =null;
    this.Myimage = null;
    this.croppedImage = null;
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
    };
  }

  confirmCropper(){
    const base64Image = this.croppedImage;
    this.imageCropper.imageBase64 =null;
    this.Myimage = null;
    this.croppedImage = null;
    this.book.cover = base64Image;
  }
  moneyMask(event,value){
    const str = event.target.value
    .replace(/\s/g,'')
    .replace(/\D/g,"")
    .replace(/(\d{0})(\d{1,2})$/,"$1.$2")
    //this.book.buy =parseFloat(str);
    console.log(str)
    //event.target.value = this.book.buy.toFixed(2).replace('.', ',');;
  }
 
}
