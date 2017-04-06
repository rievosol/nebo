import { Component } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

/*
  Generated class for the BusinessDetailMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-map',
  templateUrl: 'modal-map.html'
})
export class ModalMapPage {

  geo: string;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    this.geo = this.navParams.get('geo');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
