import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Book } from '../../model/book.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-book',
  templateUrl: './book.page.html',
  styleUrls: ['./book.page.scss'],
})
export class BookPage implements OnInit {
  book:Book = {
    cover: 'assets/add-book-icon.jpg',
    cid: '',
    name:'',
    buy:0,
    sell:0,
    desc:'',
    id:'' };
    category:any;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private util: UtilService,
    private navCtrl: NavController,
  ) { 
    this.route.queryParams.subscribe(data => {
      if (data && data.id) {
       this.util.show();
       this.book.id =data.id;
       this.getbook(data.uid,data.id);
      }else{
        this.navCtrl.back();
      }
    });
  }

  ngOnInit() {
  }

  getbook(uid,id){
    this.api.getBookById(uid,id).then((book: any) => {
      this.book = book;
      this.getcategory(book.cid)
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.showToast('Algo deu errado', 'danger', 'bottom');
      this.navCtrl.back();
    });
  }

  getcategory(id){
    this.api.getCategoryById(id).then((category: any) => {
      this.util.hide();
      this.category = category;
    }).catch(error => {

      this.util.hide();
      console.log(error);
      this.util.showToast('Algo deu errado', 'danger', 'bottom');
      this.navCtrl.back();
    });
  }

}
