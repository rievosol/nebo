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
  infiniteScroll: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService) {}

  ionViewDidLoad() {
    this.getContent().subscribe();
  }

  getContent() {
    return this.views.getView(this.viewPath)
      .map(res => {
        this.items = this.updateDetail(res.nodes);
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
    this.infiniteScroll = infiniteScroll;
    this.views.getView(this.viewPath, {
      data: this.viewData,
      scroll: this.infiniteScroll
    })
    .subscribe(res => {
      if (res.nodes && res.nodes.length) {
        let items = this.updateDetail(res.nodes);
        this.viewData = res.view;
        for (let i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
      }
    });
  }

  updateDetail(items) {
    for (let i = 0; i < items.length; i++) {
      items[i].favorited = items[i].favorited == 'True' ? true : false;
    }
    return items;
  }

  refresh(refresher) {
    this.getContent().subscribe(() => {
      refresher.complete();
      if (this.infiniteScroll) {
        this.infiniteScroll.enable(true);
      }
    });
  }

}
