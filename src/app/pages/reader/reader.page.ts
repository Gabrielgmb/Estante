import { Component, OnInit } from '@angular/core';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from "@angular/router";
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.page.html',
  styleUrls: ['./reader.page.scss'],
})
export class ReaderPage implements OnInit {
  qrScan:any;
  constructor(
    private QR: QRScanner,
    private api: ApiService,
    private util: UtilService,
    private platform: Platform,
    private router: Router,
  ) { 
    this.platform.backButton.subscribeWithPriority(0,()=>{
      document.getElementsByTagName("body")[0].style.opacity = "1";
      this.qrScan.unsubsribe();
    })
  }

  ngOnInit() {
  }

  activeReader(){
    this.QR.prepare().then((status: QRScannerStatus) => {
      if (status.authorized) {
        this.QR.show();
        document.getElementsByTagName("body")[0].style.opacity = "0";
        this.qrScan=this.QR.scan().subscribe((textFound)=>{
          document.getElementsByTagName("body")[0].style.opacity = "1";
           this.getBook(textFound);
          this.qrScan.unsubsribe();
         
        }),(err)=>{
           this.util.showToast(err, 'danger', 'bottom')
        }

      } else if (status.denied) {
      
      } else {
        
      }
    })
    .catch((e: any) => console.log('Error is', e));
  }

  getBook(code){
    this.util.showToast(code, 'success', 'bottom');
    var split =atob(code).split('-')
    const navData: NavigationExtras = {
      queryParams: {
        uid: split[0],
        id:split[1]
      }
    };
    this.router.navigate(['book'], navData);
  }

}
