import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { ApiService } from 'src/app/services/api.service';
import { Book } from '../../model/book.model';
import { UtilService } from 'src/app/services/util.service';
import { PopoverController} from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';


@Component({
  selector: 'app-shelfs',
  templateUrl: './shelfs.page.html',
  styleUrls: ['./shelfs.page.scss'],
})
export class ShelfsPage implements OnInit {
  books:Book[] = [];
  preLoad:boolean=true;
  constructor(
    private router: Router,
    private api: ApiService,
    private util: UtilService,
    private popoverController: PopoverController,
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
      this.processVenues(promise);
        console.log(promise)
    },err =>{
      console.error(err);
    })
  }

  async processVenues(books) {
    const filter = this.books.filter(function(book){ 
      const index = books.findIndex(element => book.id === element.id);
      if(index > -1){
        return book;
      }
    });
    this.books=filter;

    const promise = books.map(book => {
      const index = this.books.findIndex(element => element.id === book.id);
      if (index > -1)
        this.books[index] = book;
      else
        this.books.push(book);
    });
    this.preLoad=false;
    await Promise.all(promise);
  }

  async openMenu(item, events, i) {
    let className ='';
    if(i % 2 == 0) {
      className = 'even-menu-popover'
    }else{
      className = 'odd-menu-popover'
    }
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      cssClass: className,
      event: events,
      mode: 'ios',
      componentProps: {
        deleteButton: true,
        editButton: true,
      }
    });
    popover.onDidDismiss().then(data => {
      if (data && data.data) {
        if (data.data === 'edit') {
          const navData: NavigationExtras = {
            queryParams: {
              from: 'edit',
              id: item
            }
          };
          this.router.navigate(['add-book'], navData);
        } else if (data.data === 'delete') {
          this.api.deleteBook(localStorage.getItem('uid'),item)
        }
      }
    });

    await popover.present();
  }

  share(id){
    const navData: NavigationExtras = {
      queryParams: {
        uid: localStorage.getItem('uid'),
        id:id
      }
    };
    this.router.navigate(['qrcode'], navData);
  }

  addBook() {
    this.router.navigate(['/add-book']);
  }

  formatPrice(value) {
    return this.util.formatPrice(value);
  }


}
