import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the MoreInfoPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-more-info-popover',
  templateUrl: 'more-info-popover.html'
})
export class MoreInfoPopoverPage {
  
  node: any;
  author: string;
  createdDate: any;
  updatedDate: any;
  expireDate: any;
  expireInterval: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams) {
    this.node = this.navParams.get('node');
  }
  
  ionViewDidLoad() {
    this.author = this.node.author;
    let createdTimestamp = parseInt(this.node.created);
    this.createdDate = new Date(createdTimestamp * 1000);
    let updatedTimestamp = parseInt(this.node.changed);
    this.updatedDate = new Date(updatedTimestamp * 1000);
    let expireTimestamp = parseInt(this.node.neerby_access_expire_date);
    this.expireDate = new Date(expireTimestamp * 1000);
    this.expireInterval = this.node.neerby_access_expire_date_interval;
  }

}
