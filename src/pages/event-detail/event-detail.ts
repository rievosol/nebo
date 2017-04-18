import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';

import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { MoreInfoPopoverPage } from '../more-info-popover/more-info-popover';
import { ModalMapPage } from '../modal-map/modal-map';
import { EventEditFormPage } from '../event-edit-form/event-edit-form';
import { GalleryPage } from '../gallery/gallery';
import { NodeService } from '../../providers/node-service';
import { Util } from '../../providers/util';

/*
  Generated class for the EventDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-detail',
  templateUrl: 'event-detail.html'
})
export class EventDetailPage {
  
  type: string;
  node: any;
  private _nid: number;
  title: string;
  body: string;
  state: string;
  group: any;
  phone: string;
  sms: any;
  geo: any;
  position: any;
  images: any[];
  start: string;
  timeToStart: string;
  expireInterval: string;
  canEdit: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public nodeService: NodeService,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController,
              public sanitizer: DomSanitizer,
              public util: Util) {
    this.type = 'Event';
    this.node = {};
    this.title = navParams.get('title');
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this._nid = this.navParams.data.nid;
    this.title = this.navParams.data.title;
    this.nodeService.load(this._nid).subscribe(node => {
      console.log(node);
      this.node = node;
      this.canEdit = this.nodeService.checkPermissionEdit(node);
      this.title = node.title;
      this.body = node.body.und ? node.body.und[0].value : '';
      this.group = node.og_group_ref.und[0];
      this.images = node.field_image.und ? node.field_image.und : [];
      this.expireInterval = node.neerby_access_expire_date_interval;
      this.start = this.getDateString(node.field_date.und[0].value);
      this.timeToStart = this.getTimeToStart(node.field_date.und[0].value);
      this.phone = node.field_phone.und ? node.field_phone.und[0].value : '';
      this.sms = this.util.sanitize('sms:' + this.phone);
      if (node.field_position.und) {
        let pos = node.field_position.und[0];
        this.position = {
          lat: pos.lat,
          lon: pos.lon,
          geo: pos.lat + ',' + pos.lon
        };
        this.geo = this.util.sanitize('geo:' + this.position.geo);
      }
      else {
        this.position = null;
      }
      this.state = 'loaded';
    });
  }

  viewRefNode() {
    let params = {
      nid: this.group.target_id,
      title: this.group.title
    };
    switch (this.group.bundle) {
      case 'business':
        this.navCtrl.push(BusinessDetailPage, params);
        break;

      case 'organization':
        this.navCtrl.push(OrganizationDetailPage, params);
        break;
    }
  }

  viewMoreInfo(ev) {
    let popover = this.popoverCtrl.create(MoreInfoPopoverPage, {
      node: this.node
    });
    popover.present({
      ev: ev
    });
  }

  editNode() {
    this.navCtrl.push(EventEditFormPage, { nid: this._nid });
  }

  getDate(date) {
    date = date.trim().replace(' ', 'T') + 'Z';
    return new Date(date);
  }

  getDateString(date) {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let _date = this.getDate(date);
    let out = days[_date.getDay()] + ', ';
    out += _date.getDate() + '/' + (_date.getMonth() + 1).toString() + '/' + _date.getFullYear() + ' ';
    let h = _date.getHours();
    let a = 'am';
    if (h > 12) {
      out += (h - 12).toString() + ':';
      a = 'pm';
    }
    else {
      out += h.toString() + ':';
    }
    let m = _date.getMinutes().toString();
    out += m.length == 1 ? '0' + m : m;
    out += a;
    return out;
  }

  getTimeToStart(date) {
    let now = new Date();
    let start = this.getDate(date);
    let interval = (start.getTime() - now.getTime()) / 1000;
    if (interval > 0) {
      let rem = interval;
      let d = Math.floor(rem / (60 * 60 * 24));
      rem = rem % (60 * 60 * 24);
      let h = Math.floor(rem / (60 * 60));
      rem = rem % (60 * 60);
      let m = Math.floor(rem / 60);
      rem = rem % 60;
      let s = rem;
      let out = '';
      if (d > 0) {
        out += d + 'd';
        out += h > 0 ? ' ' + h + 'h' : ''; 
      }
      else if (h > 0) {
        out += h + 'h';
        out += m > 0 ? ' ' + m + 'm' : '';
      }
      else if (m > 0) {
        out += m + 'm';
        out += s > 0 ? ' ' + s + 's' : '';
      }
      else {
        out += s + 's';
      }
      return out;
    }
    return '';
  }

  displayActionButton(item: string) {
    switch (item) {
      case 'call':
        return this.phone ? true : false;

      case 'sms':
        if (this.phone) {
          let firstZero = this.phone.search('0');
          if (this.phone.charAt(firstZero + 1) == '1') {
            return true;
          }
          return false;
        }
        return false;

      case 'navigate':
      case 'map':
        return this.position && this.position.lat && this.position.lon ? true : false;
    }
  }

  displayActionButtons() {
    if (this.phone || (this.position && this.position.lat && this.position.lon)) {
      return true;
    }
    return false;
  }

  showMap() {
    let map = this.modalCtrl.create(ModalMapPage, { geo: this.position.geo });
    map.present();
  }

  showGallery(index) {
    index = index || 0;
    let images = [];
    for (let image of this.images) {
      images.push(image);
    }
    let gallery = this.modalCtrl.create(GalleryPage, {
      images: images,
      start: index
    });
    gallery.present();
  }

}