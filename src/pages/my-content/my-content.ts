import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { ViewsService } from '../../providers/views-service';

/*
  Generated class for the MyContent page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-content',
  templateUrl: 'my-content.html'
})
export class MyContentPage {

  items: any[] = [];
  state: string = 'loading';
  viewData: any = {};
  viewPath: string = 'user.ownContent';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService) {
    
  }

  ionViewDidLoad() {
    this.views.getView(this.viewPath)
      .subscribe(res => {
        this.items = res.nodes;
        this.viewData = res.view;
        this.state = 'loaded';
      });
  }

  itemSelected(item) {
    let opt = {
      nid: item.nid,
      title: item.title
    };
    switch (item.type) {
      case 'business':
        this.navCtrl.push(BusinessDetailPage, opt);
        break;

      case 'organization':
        this.navCtrl.push(OrganizationDetailPage, opt);
        break;

      case 'announcement':
        this.navCtrl.push(AnnouncementDetailPage, opt);
        break;

      case 'event':
        this.navCtrl.push(EventDetailPage, opt);
        break;
    }
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
