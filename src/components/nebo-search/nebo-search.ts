import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SearchResult } from '../../pages/search-result/search-result';

@Component({
  selector: 'nebo-search',
  template: `
    <button ion-button icon-only (click)="search()">
      <ion-icon name="search"></ion-icon>
    </button>
  `
})
export class NeboSearch {
  
  constructor(public navCtrl: NavController) {
    
  }

  search() {
    this.navCtrl.push(SearchResult);
  }
}