import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewsService } from '../../providers/views-service';
import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';

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

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public views: ViewsService) {
  }

  ionViewDidLoad() {
    
  }

  suggest(ev: any) {
    this.show = 'suggestion';
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.views.getView('search.autocomplete', {
        params: [{
            key: 'title',
            value: encodeURIComponent(val)
        }]
      })
      .subscribe(res => {
        this.suggestionItems = res.nodes;
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
        this.views.getView('search.nearby', {
          append: [encodeURIComponent(this.searchTerm)]
        })
        .subscribe(res => {
          this.resultItems = res.nodes;
          this.state = 'loaded';
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

}
