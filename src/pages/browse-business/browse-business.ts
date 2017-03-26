import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Api } from '../../providers/api';
import { BusinessDetailPage } from '../business-detail/business-detail';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/from';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public api: Api) {}

  ionViewDidLoad() {
    this.http.get(this.url)
      .concatMap(res => {
        let data = res.json();
        return Observable.from(data.nodes);
      })
      .subscribe(node => {
        this.items.push(node);
      });
  }

  itemSelected(item) {
    this.navCtrl.push(BusinessDetailPage, {nid: item.nid});
  }

}
