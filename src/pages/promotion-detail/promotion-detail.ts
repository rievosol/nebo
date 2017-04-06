import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the PromotionDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-promotion-detail',
  templateUrl: 'promotion-detail.html'
})
export class PromotionDetailPage {

  title: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.title = navParams.get('title');
  }

  ionViewDidLoad() {
    
  }

}
