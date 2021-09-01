import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Book } from '../../model/book.model';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

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
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private util: UtilService,
  ) { 
    this.route.queryParams.subscribe(data => {
      if (data && data.id) {
       this.book.id =data.id;
       this.getbook(data.uid,data.id);
      }
    });
  }

  ngOnInit() {
  }

  getbook(uid,id){
    this.api.getBookById(uid,id).then((book: any) => {
      console.log(book)
      this.book = book;
    }).catch(error => {
      console.log(error);
      this.util.showToast('Algo deu errado', 'danger', 'bottom');
    });
  }

}
