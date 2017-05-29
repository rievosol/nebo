import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the Gallery page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html'
})
export class GalleryPage {

  images: any[];
  start: number;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.images = this.navParams.data.images;
    this.start = this.navParams.data.start || 0;
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
