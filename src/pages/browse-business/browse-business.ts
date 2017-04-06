import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

import { Api } from '../../providers/api';
import { ViewsService } from '../../providers/views-service';
import { BusinessDetailPage } from '../business-detail/business-detail';

/*
  Generated class for the BrowseBusiness page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-browse-business',
  templateUrl: 'browse-business.html'
})
export class BrowseBusinessPage {

  items: any[] = [];
  url: string = this.api.url + '/testing-business-listing.json';
  state: string = 'loading';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public api: Api,
              public views: ViewsService) {}

  ionViewDidLoad() {
    this.views.getView('browse.business')
      .subscribe(nodes => {
        this.items = nodes;
        this.state = 'loaded';
      });
  }

  itemSelected(item) {
    this.navCtrl.push(BusinessDetailPage, {
      nid: item.nid,
      title: item.title
    });
  }

}
