import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
})
export class QrcodePage implements OnInit {
  qrcode:string
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipboard: Clipboard,
    private socialSharing: SocialSharing
  ) { 
    this.route.queryParams.subscribe(data => {
      if (data && data.uid) {
       this.createBase64(data.uid,data.id);
      } 
    });
  }

  ngOnInit() {
  }
  createBase64(uid,id){
    this.qrcode = window.btoa(uid+'-'+id);
  }

  share(){
    this.socialSharing.share('qrcode');
  }

  copyCode(){
    this.clipboard.copy('Hello world');
  }
}
