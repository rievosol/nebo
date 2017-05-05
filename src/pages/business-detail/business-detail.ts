import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { NavController, NavParams, LoadingController, ToastController, ModalController, PopoverController } from 'ionic-angular';

import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { ModalMapPage } from '../modal-map/modal-map';
import { MoreInfoPopoverPage } from '../more-info-popover/more-info-popover';
import { GalleryPage } from '../gallery/gallery';

import { NodeService } from '../../providers/node-service';
import { FlagService } from '../../providers/flag-service';
import { Util } from '../../providers/util';

/*
  Generated class for the BusinessDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-business-detail',
  templateUrl: 'business-detail.html'
})
export class BusinessDetailPage {

  node: any;
  title: string;
  body: string;
  category: string;
  images: any[] = [];
  canEdit: boolean = false;
  phone: string;
  sms: any;
  geo: any;
  position: any;
  childNodes: any;
  favoriteText: string = 'Favorite';
  favoriteColor: string = 'light';
  favoriteCount: string;
  state: string = 'loading';
  
  private _nid: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public sanitizer: DomSanitizer,
              public loadingCtrl: LoadingController,
              public http: Http,
              public nodeService: NodeService,
              public flagService: FlagService,
              public toastCtrl: ToastController,
              public modalCtrl: ModalController,
              public popoverCtrl: PopoverController,
              public util: Util) {
    this.node = {};
    this.childNodes = {
      announcement: [],
      event: [],
      promotion: []
    };
    this.position = {
      lat: '',
      lon: '',
      geo: ''
    };
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this._nid = this.navParams.data.nid;
    this.title = this.navParams.data.title;
    this.loadNode().subscribe(status => {
      this.state = 'loaded';
    })
  }

  loadNode() {
    return this.nodeService.load(this._nid)
      .flatMap(node => {
        console.log(node);
        Object.assign(this.node, node);
        this.title = node.title;
        this.body = node.body.und ? node.body.und[0].value : '';
        this.canEdit = this.nodeService.checkPermissionEdit(node);
        this.category = node.field_category_business.und[0].name;
        this.images = node.field_image.und ? node.field_image.und : [];
        this.phone = node.field_phone.und ? node.field_phone.und[0].value : '';
        this.sms = this.util.sanitize('sms:' + this.phone);
        if (node.field_position.und) {
          let position = node.field_position.und[0];
          this.position = {
            lat: position.lat,
            lon: position.lon,
            geo: position.lat + ',' + position.lon
          };
          this.geo = this.util.sanitize('geo:' + this.position.geo);
        }
        else {
          this.position = null;
        }
        
        this.node.flag = node.flag_status;
        this.favoriteCount = node.flag_count['favorites'] ? node.flag_count['favorites'] : '';
        this.updateFavorite(node.flag_status['favorites']);
        return this.nodeService.getChildNodes(node);
      })
      .map(nodes => {
        this.childNodes = nodes;
        return true;
      });
  }

  editNode() {
    this.navCtrl.push(BusinessEditFormPage, {nid: this._nid});
  }

  displaySection(type) {
    switch (type) {
      case 'announcement':
      case 'event':
        if (this.childNodes[type]) {
          return this.childNodes[type].length == 0 ? false : true;
        }
        return false;
      
      case 'gallery':
        return this.images.length == 0 ? false : true;
    }
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

  viewChildNode(item) {
    let params = {
      nid: item.nid,
      title: item.title
    };
    switch (item.type) {
      case 'announcement':
        this.navCtrl.push(AnnouncementDetailPage, params);
        break;

      case 'event':
        this.navCtrl.push(EventDetailPage, params);
        break;
    }
  }

  favorite() {
    let loading = this.loadingCtrl.create();
    loading.present();
    
    let initialFlag = this.node.flag['favorites'];
    this.flagService.flag(this.node, 'favorites')
      .subscribe(res => {
        loading.dismiss();
        if (res[0]) {
          this.updateFavorite(!initialFlag);
          this.showToast(!initialFlag);
        }
      });
    
  }

  updateFavorite(flagged: boolean) {
    this.node.flag['favorites'] = flagged;
    if (flagged) {
      this.favoriteText = 'Favorited';
      this.favoriteColor = 'primary';
    }
    else {
      this.favoriteText = 'Favorite';
      this.favoriteColor = 'light';
    }
  }

  showToast(flag) {
    let message = 'Removed from your Favorites';
    if (flag) {
      message = 'Added to your Favorites';
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  showMap() {
    let map = this.modalCtrl.create(ModalMapPage, { geo: this.position.geo });
    map.present();
  }

  viewMoreInfo(ev) {
    let popover = this.popoverCtrl.create(MoreInfoPopoverPage, {
      node: this.node
    });
    popover.present({
      ev: ev
    });
  }

  showFavoriteCount() {
    if (this.favoriteCount && this.favoriteCount !== '0') {
      return true;
    }
    return false;
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
