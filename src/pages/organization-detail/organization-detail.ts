import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { NavController, NavParams, LoadingController, ToastController, ModalController, PopoverController } from 'ionic-angular';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { ModalMapPage } from '../modal-map/modal-map';
import { MoreInfoPopoverPage } from '../more-info-popover/more-info-popover';
import { GalleryPage } from '../gallery/gallery';
import { NodeService } from '../../providers/node-service';
import { FlagService } from '../../providers/flag-service';
import { Util } from '../../providers/util';

import { OrganizationEditFormPage } from '../organization-edit-form/organization-edit-form';

/*
  Generated class for the OrganizationDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-organization-detail',
  templateUrl: 'organization-detail.html'
})
export class OrganizationDetailPage {
  
  private type: string = 'organization';
  private editPage: any = OrganizationEditFormPage;
  
  state: string = 'loading';
  node: any = {};
  title: string;
  body: string;
  category: string;
  images: any[] = [];
  profilePicture: string;
  canEdit: boolean = false;
  phone: string;
  sms: any;
  geo: any;
  position: any = null;
  childNodes: any;
  favoriteText: string = 'Favorite';
  favoriteColor: string = 'light';
  favoriteCount: string;
  private nid: any;

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
    this.childNodes = {
      announcement: [],
      event: [],
      promotion: []
    };
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this.nid = this.navParams.data.nid;
    this.title = this.navParams.data.title;
    this.loadNode().subscribe(() => {
      this.state = 'loaded';
    });
  }

  loadNode() {
    return this.nodeService.load(this.nid)
      .flatMap(node => {
        console.log(node);
        Object.assign(this.node, node);
        // Fields
        this.profilePicture = node.field_profile_picture.und ? node.field_profile_picture.und[0].url : '';
        this.title = node.title;
        this.body = node.body.und ? node.body.und[0].value : '';
        this.category = node['field_category_' + this.type].und[0].name;
        this.phone = node.field_phone.und ? node.field_phone.und[0].value : '';
        this.sms = this.util.sanitize('sms:' + this.phone);
        this.images = node.field_image.und ? node.field_image.und : [];
        this.position = node.field_position.und ? node.field_position.und[0] : this.position;
        this.geo = this.position.geo ? this.util.sanitize('geo:' + this.position.geo) : '';
        
        // Features
        this.node.flag = node.flag_status;
        this.favoriteCount = node.flag_count['favorites'] ? node.flag_count['favorites'] : '';
        this.updateFavoriteBtn(node.flag_status['favorites']);
        this.canEdit = this.nodeService.checkPermissionEdit(node);

        return this.nodeService.getChildNodes(node);
      })
      .map(childNodes => {
        this.childNodes = childNodes;
      });
  }

  editNode() {
    this.navCtrl.push(this.editPage, {nid: this.nid});
  }

  displaySection(type) {
    switch (type) {
      case 'announcement':
      case 'event':
        return (this.childNodes[type] && this.childNodes[type].length) ? true : false;
      
      case 'gallery':
        return this.images.length ? false : true;
    }
  }

  displayActionButton(item: string) {
    switch (item) {
      case 'call':
        return this.phone ? true : false;

      case 'sms':
        return (this.phone && this.phone.charAt(this.phone.search('0') + 1) == '1') ? true : false;

      case 'navigate':
      case 'map':
        return (this.position && this.position.lat && this.position.lon) ? true : false;
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
          this.updateFavoriteBtn(!initialFlag);
          this.showToast(!initialFlag);
        }
      });
  }

  updateFavoriteBtn(flagged: boolean) {
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
    if (this.position) {
      let map = this.modalCtrl.create(ModalMapPage, {
        title: this.title,
        position: this.position
      });
      map.present();
    }
  }

  viewMoreInfo(ev) {
    let popover = this.popoverCtrl.create(MoreInfoPopoverPage, { node: this.node });
    popover.present({ ev: ev });
  }

  showFavoriteCount() {
    return (this.favoriteCount && this.favoriteCount !== '0') ? true: false;
  }

  showGallery(index) {
    index = index || 0;
    let gallery = this.modalCtrl.create(GalleryPage, {
      images: this.images,
      start: index
    });
    gallery.present();
  }

}
