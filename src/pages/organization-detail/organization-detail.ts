import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { NavController, NavParams, LoadingController, ToastController, ModalController, PopoverController, AlertController } from 'ionic-angular';
import { AnnouncementDetailPage } from '../announcement-detail/announcement-detail';
import { EventDetailPage } from '../event-detail/event-detail';
import { ModalMapPage } from '../modal-map/modal-map';
import { MoreInfoPopoverPage } from '../more-info-popover/more-info-popover';
import { GalleryPage } from '../gallery/gallery';
import { NodeService } from '../../providers/node-service';
import { FlagService } from '../../providers/flag-service';
import { Util } from '../../providers/util';
import { GeolocationService } from '../../providers/geolocation-service';
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
  distance: string = '';
  childNodes: any;
  favoriteText: string = 'Favorite';
  favoriteColor: string = 'light';
  favoriteCount: string;
  recommendText: string = 'Recommend';
  recommendColor: string = 'light';
  recommendCount: string;
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
              public util: Util,
              public alertCtrl: AlertController,
              public geolocation: GeolocationService) {
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
    this.loadNode().subscribe();
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
        this.recommendCount = node.flag_count['recommend'] ? node.flag_count['recommend'] : '';
        this.updateRecommendBtn(node.flag_status['recommend']);
        this.canEdit = this.nodeService.checkPermissionEdit(node);

        return this.nodeService.getChildNodes(node);
      })
      .flatMap(childNodes => {
        this.childNodes = childNodes;
        this.state = 'loaded';
        return this.geolocation.calculateDistanseFromCurrentLocation(this.position, true)
          .map(dist => {
            this.distance = dist.toFixed(2).toString() + ' km away';
          });
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
  
  /**
   * If both Favorite & Recommend flags are false,
   * a user may simultaneously activate both flags
   * if Favorite flag is first raised.
   */
  favorite() {
    let initFav = this.node.flag['favorites'];
    let initRec = this.node.flag['recommend'];

    let flagFav = () => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.flagService.flag(this.node, 'favorites')
        .subscribe(res => {
          this.updateFavoriteBtn(!initFav);
          this.showToastFavorites(!initFav);
          loading.dismiss();
        });
    };

    if (!initFav && !initRec) {
      let alert = this.alertCtrl.create({
        title: 'Recommend this?',
        message: 'Would you like to also recommend this ' + this.type + '?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              flagFav();
            }
          },
          {
            text: 'Yes',
            handler: () => {
              let loading = this.loadingCtrl.create();
              loading.present();
              this.flagService.flag(this.node, 'favorites')
                .flatMap(res => {
                  return this.flagService.flag(this.node, 'recommend')
                })
                .subscribe(res => {
                  this.updateFavoriteBtn(!initFav);
                  this.updateRecommendBtn(!initRec);
                  loading.dismiss();
                  let toast = this.toastCtrl.create({
                    message: 'Added to your Favorites and thanks for your recommendation',
                    duration: 3000,
                    position: 'bottom'
                  });
                  toast.present();
                });
            }
          }
        ]
      });
      alert.present();
    }
    else {
      flagFav();
    }
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

  recommend() {
    let loading = this.loadingCtrl.create();
    loading.present();

    let init = this.node.flag['recommend'];
    this.flagService.flag(this.node, 'recommend')
      .subscribe(res => {
        loading.dismiss();
        if (res[0]) {
          this.updateRecommendBtn(!init);
          this.showToastRecommend(!init);
        }
      });
  }

  updateRecommendBtn(flagged: boolean) {
    this.node.flag['recommend'] = flagged;
    this.recommendText = flagged ? 'Recommended' : 'Recommend';
    this.recommendColor = flagged ? 'primary' : 'light';
  }
  
  showToastRecommend(flag) {
    let message = flag ? 'Thank you for your recommendation' : 'You are no longer recommending this';
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  showToastFavorites(flag) {
    let message = flag ? 'Added to your Favorites' : 'Removed from your Favorites';
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
