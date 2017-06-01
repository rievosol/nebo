import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ViewsService } from '../../providers/views-service';
import { GeolocationService } from '../../providers/geolocation-service';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { Observable } from 'rxjs/Observable';

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

  viewPath: string = 'browse.organization';
  detailPage: any = OrganizationDetailPage;

  items: any[] = [];
  state: string = 'loading';
  viewData: any = {};
  infiniteScroll: any;
  proximity: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService,
              public geolocation: GeolocationService,
              public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    this.geolocation.getPosition(null, true)
      .flatMap(res => {
        if (res['error']) {
          return Observable.of(res);
        }
        this.proximity = this.geolocation.createFilterString(res, 10);
        return this.getContent();
      })
      .subscribe(res => {
        this.state = 'loaded';
        if (res && res['error']) {
          let alert = this.alertCtrl.create({
            title: 'Position error',
            message: 'We cannot seem to find your accurate position. Have you enabled your GPS?',
            buttons: ['OK']
          });
          alert.present();
        }
      });
  }

  getContent() {
    return this.views.getView(this.viewPath, {
      append: [this.proximity]
    })
    .map(res => {
      this.items = this.updateDetail(res['nodes']);
      this.viewData = res['view'];
      return null;
    });
  }

  itemSelected(item) {
    this.navCtrl.push(this.detailPage, {
      nid: item.nid,
      title: item.title
    });
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.views.getView(this.viewPath, {
      data: this.viewData,
      scroll: this.infiniteScroll,
      append: [this.proximity]
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
      let item = items[i];
      item.favorited = item.favorited == 'True' ? true : false;
      item.formattedDistance = parseFloat(item.distance).toFixed(2);
      items[i] = item;
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
