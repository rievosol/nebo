import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the AnnouncementDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-announcement-detail',
  templateUrl: 'announcement-detail.html'
})
export class AnnouncementDetailPage {

  title: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.title = navParams.get('title');
  }

  ionViewDidLoad() {
    
  }

}
