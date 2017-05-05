import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  state: string = 'loading';
  viewData: any = {};
  viewPath: string = 'browse.business';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService) {}

  ionViewDidLoad() {
    this.views.getView(this.viewPath)
      .subscribe(res => {
        this.items = res.nodes;
        this.viewData = res.view;
        this.state = 'loaded';
      });
  }

  itemSelected(item) {
    this.navCtrl.push(BusinessDetailPage, {
      nid: item.nid,
      title: item.title
    });
  }

  doInfinite(infiniteScroll) {
    this.views.getView(this.viewPath, {
      data: this.viewData,
      scroll: infiniteScroll
    })
    .subscribe(res => {
      if (res.nodes && res.nodes.length) {
        this.viewData = res.view;
        for (let i = 0; i < res.nodes.length; i++) {
          this.items.push(res.nodes[i]);
        }
      }
    });
  }

}
