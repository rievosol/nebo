import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ActionSheetController, ModalController } from 'ionic-angular';

import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';
import { OrganizationEditFormPage } from '../organization-edit-form/organization-edit-form';
import { AnnouncementEditFormPage } from '../announcement-edit-form/announcement-edit-form';
import { EventEditFormPage } from '../event-edit-form/event-edit-form';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { PromotionDetailPage } from '../promotion-detail/promotion-detail';
import { SearchResult } from '../search-result/search-result';
import { ModalMapPage } from '../modal-map/modal-map';

import { ViewsService } from '../../providers/views-service';
import { Api } from '../../providers/api';
import { NodeService } from '../../providers/node-service';
import { GeolocationService } from '../../providers/geolocation-service';
import { GoogleMaps } from '../../providers/google-maps';

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
  canAddContent: boolean = false;
  location: string;
  findLocation: string = 'finding';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController,
              public views: ViewsService,
              public api: Api,
              public nodeService: NodeService,
              public modalCtrl: ModalController,
              public geolocation: GeolocationService,
              public googleMaps: GoogleMaps,
              private zone: NgZone) {
    this.canAddContent = this.nodeService.checkPermissionAdd(this.nodeService.getNodeTypes());
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this.geolocation.getPosition()
      .flatMap(position => {
        return this.googleMaps.geocode(position);
      })
      .subscribe(names => {
        this.zone.run(() => {
          let sublocality = names['sublocality'] ? names['sublocality'] + ', ' : '';
          this.location = sublocality + names['locality'];
          this.findLocation = 'found';
        });
      });

    this.getContent().subscribe(() => {
      this.state = 'loaded';
    });
  }

  getContent() {
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
    return this.views.getViews(opts).map(res => {
      console.log(res);
      this.announcements = res['announcement'];
      this.events = res['event'];
      this.promotions = res['promotion'];
    });
  }

  addContent() {
    let options: any = {
      title: 'Create content',
      buttons: []
    };
    let types = this.nodeService.getNodeTypes('create');
    for (let i = 0; i < types.length; i++) {
      switch (types[i]) {
        case 'business':
          options.buttons.push({
            text: 'Business',
            handler: () => this.navCtrl.push(BusinessEditFormPage)
          });
          break;

        case 'organization':
          options.buttons.push({
            text: 'Organization',
            handler: () => this.navCtrl.push(OrganizationEditFormPage)
          });
          break;

        case 'announcement':
          options.buttons.push({
            text: 'Announcement',
            handler: () => this.navCtrl.push(AnnouncementEditFormPage)
          });
          break;

        case 'event':
          options.buttons.push({
            text: 'Event',
            handler: () => this.navCtrl.push(EventEditFormPage)
          });
          break;
      }
    }
    if (options.buttons.length > 0) {
      options.buttons.push({
        text: 'Cancel',
        role: 'cancel'
      });
      let actionSheet = this.actionSheetCtrl.create(options);
      actionSheet.present();
    }
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

  search() {
    this.navCtrl.push(SearchResult);
  }

  showMap() {
    let modal = this.modalCtrl.create(ModalMapPage, {
      lat: this.geolocation.position.latitude,
      lon: this.geolocation.position.longitude,
      title: 'Your current location'
    });
    modal.present();
  }

  refresh(refresher) {
    this.getContent().subscribe(() => {
      refresher.complete();
    });
  }

}
