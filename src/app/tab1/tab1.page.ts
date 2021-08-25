import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  shelfs = [];

  constructor(
    private api: ApiService,
  ) {

  }

  getAllCuisines(){
    this.api.getAllShelf()
    .then(data=>{
      this.shelfs = data;
      console.log(this.shelfs)
    })
  }
}
