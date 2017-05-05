import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { ViewsService } from '../../providers/views-service';

/*
  Generated class for the MyFavorites page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-my-favorites',
  templateUrl: 'my-favorites.html'
})
export class MyFavoritesPage {

  state: string = 'loading';
  items: any = {};
  viewData: any = {};
  activeType: string = 'business';
  activeViewPath: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService) {
    
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this.setActiveViewPath();
    this.views.getView(this.activeViewPath)
      .subscribe(res => {
        this.items[this.activeType] = res.nodes;
        this.viewData[this.activeType] = res.view;
        this.state = 'loaded';
      });
  }

  ionViewDidLoad() {
    
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
    }
  }

  doInfinite(infiniteScroll) {
    console.log('infinite scroll triggered');
    this.views.getView(this.activeViewPath, {
      data: this.viewData[this.activeType],
      scroll: infiniteScroll
    })
    .subscribe(res => {
      if (res.nodes && res.nodes.length) {
        this.viewData[this.activeType] = res.view;
        for (let i = 0; i < res.nodes.length; i++) {
          this.items[this.activeType].push(res.nodes[i]);
        }
      }
    });
  }

  segmentSelected(type: string) {
    this.activeType = type;
    this.setActiveViewPath();
    if (!this.viewData[this.activeType]) {
      this.state = 'loading';
      this.views.getView(this.activeViewPath)
        .subscribe(res => {
          this.items[this.activeType] = res.nodes;
          this.viewData[this.activeType] = res.view;
          this.state = 'loaded';
        });
    }
  }

  setActiveViewPath() {
    this.activeViewPath = 'favorites.' + this.activeType;
  }

}
