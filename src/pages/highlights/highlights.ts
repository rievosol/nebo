import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';
import { AnnouncementEditFormPage } from '../announcement-edit-form/announcement-edit-form';
import { EventEditFormPage } from '../event-edit-form/event-edit-form';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { PromotionDetailPage } from '../promotion-detail/promotion-detail';
import { ViewsService } from '../../providers/views-service';
import { Api } from '../../providers/api';
import { NodeService } from '../../providers/node-service';

/*
  Generated class for the Highlights page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-highlights',
  templateUrl: 'highlights.html'
})
export class HighlightsPage {

  announcements: any[];
  events: any[];
  promotions: any[];
  state: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public views: ViewsService,
              public api: Api,
              public nodeService: NodeService) {
    
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    let opts = [
      {
        key: 'announcement',
        path: 'highlights.announcement'
      },
      {
        key: 'event',
        path: 'highlights.event'
      },
      {
        key: 'promotion',
        path: 'highlights.promotion'
      }
    ];
    this.views.getViews(opts).subscribe(res => {
      console.log(res);
      this.announcements = res['announcement'];
      this.events = res['event'];
      this.promotions = res['promotion'];
      this.state = 'loaded';
    });

  }

  addContent() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Create content',
      buttons: [
        {
          text: 'Business',
          handler: () => this.navCtrl.push(BusinessEditFormPage)
        },
        {
          text: 'Announcement',
          handler: () => this.navCtrl.push(AnnouncementEditFormPage)
        },
        {
          text: 'Event',
          handler: () => this.navCtrl.push(EventEditFormPage)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

  itemSelected(item) {
    let params = {
      nid: item.nid,
      title: item.title
    };
    switch(item.type) {
      case 'announcement':
        this.navCtrl.push(AnnouncementDetailPage, params);
        break;

      case 'event':
        this.navCtrl.push(EventDetailPage, params);
        break;

      case 'promotion':
        this.navCtrl.push(PromotionDetailPage, params);
        break;
    }
  }

}
