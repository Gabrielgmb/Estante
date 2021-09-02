import { Component, OnInit } from '@angular/core';
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
    this.socialSharing.share(this.qrcode);
  }

  copyCode(){
    this.clipboard.copy(this.qrcode);
  }
}
