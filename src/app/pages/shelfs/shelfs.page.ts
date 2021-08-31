import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ApiService } from 'src/app/services/api.service';
import { Book } from '../../model/book.model';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-shelfs',
  templateUrl: './shelfs.page.html',
  styleUrls: ['./shelfs.page.scss'],
})
export class ShelfsPage implements OnInit {
  books:Book[] = [];
  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
  ) { }

  ngOnInit() {
    this.listenBooks();
  }

  listenBooks(){
    this.api.listenBooks(localStorage.getItem('uid')).subscribe(async books =>{
      const promise = books.map((book: any)=>{
        book = book.payload.doc.data();
        return book;
      });
      this.books =promise;
        console.log(promise)
    },err =>{
      console.error(err);
    })
  }

  addBook() {
    this.router.navigate(['/add-book']);
  }

  formatPrice(value) {
    return this.util.formatPrice(value);
  }

}
