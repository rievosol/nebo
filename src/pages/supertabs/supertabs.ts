import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Page1 } from '../page1/page1';
import { Page2 } from '../page2/page2';

/*
  Generated class for the Supertabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-supertabs',
  templateUrl: 'supertabs.html'
})
export class SupertabsPage {

  page1: any = Page1;
  page2: any = Page2;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SupertabsPage');
  }

}
