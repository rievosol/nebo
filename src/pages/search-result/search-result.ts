import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewsService } from '../../providers/views-service';
import { GeolocationService } from '../../providers/geolocation-service';
import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the SearchResult page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResult {

  suggestionItems: any[] = [];
  resultItems: any[] = [];
  state: string = 'loaded';
  show: string = 'suggestion';
  searchTerm: string = '';
  emptyResults: boolean = false;
  viewPath: string = 'search.nearby';
  viewData: any = {};
  infiniteScroll: any;
  proximity: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService,
              public geolocation: GeolocationService) {
  }

  ionViewDidLoad() {
    
  }

  suggest(ev: any) {
    this.show = 'suggestion';
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.geolocation.getPosition(null, true)
        .flatMap(res => {
          if (res['error']) {
            return Observable.of(res);
          }
          this.proximity = this.geolocation.createFilterString(res, 20);
          return this.views.getView('search.autocomplete', {
            params: [{
              key: 'title',
              value: encodeURIComponent(val)
            }],
            append: [this.proximity]
          });
        })
        .subscribe(res => {
          if (res['nodes']) {
            this.suggestionItems = res['nodes'];
          }
        });
    }
    else {
      this.suggestionItems = [];
    }
  }

  search(item: any, from: string) {
    switch (from) {
      case 'searchbar':
        this.state = 'loading';
        this.show = 'result';
        this.emptyResults = false;
        this.viewData = {}; // Reset everything

        this.geolocation.getPosition(null, true)
          .flatMap(res => {
            if (res['error']) {
              return Observable.of(res);
            }
            this.proximity = this.geolocation.createFilterString(res, 20);
            return this.views.getView(this.viewPath, {
              append: [encodeURIComponent(this.searchTerm), this.proximity]
            });
          })
          .subscribe(res => {
            this.state = 'loaded';
            if (res['error']) {
              this.emptyResults = true;
            }
            else {
              this.resultItems = this.updateDetail(res['nodes']);
              this.viewData = res['view'];
              if (this.resultItems.length == 0) {
                this.emptyResults = true;
              }
            }
          });
        break;

      case 'suggestion':
        this.itemSelected(item);
        break;
    }
  }

  itemSelected(item) {
    let params = {
      nid: item.nid,
      title: item.title
    };
    switch (item.type) {
      case 'business':
        this.navCtrl.push(BusinessDetailPage, params);
        break;

      case 'organization':
        this.navCtrl.push(OrganizationDetailPage, params);
        break;
    }
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.views.getView(this.viewPath, {
      data: this.viewData,
      scroll: this.infiniteScroll,
      append: [encodeURIComponent(this.searchTerm), this.proximity]
    })
    .subscribe(res => {
      if (res.nodes && res.nodes.length) {
        let items = this.updateDetail(res.nodes);
        this.viewData = res.view;
        for (let i = 0; i < items.length; i++) {
          this.resultItems.push(items[i]);
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

}
