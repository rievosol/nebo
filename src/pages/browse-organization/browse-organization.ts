import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ViewsService } from '../../providers/views-service';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';

/*
  Generated class for the BrowseOrganization page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-browse-organization',
  templateUrl: 'browse-organization.html'
})
export class BrowseOrganizationPage {

  items: any[] = [];
  state: string = 'loading';
  viewData: any = {};
  viewPath: string = 'browse.organization';

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
    this.navCtrl.push(OrganizationDetailPage, {
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
