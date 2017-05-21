import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { ViewsService } from '../../providers/views-service';

/**
 * Generated class for the ModalSearch page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-search',
  templateUrl: 'modal-search.html',
})
export class ModalSearch {

  items: any[] = [];

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public views: ViewsService) {
    
  }

  ionViewDidLoad() {
    
  }

  suggest(ev: any) {
    let val = ev.target.value;
    console.log(val);
    if (val && val.trim() != '') {
      this.views.getView('search.autocomplete', {
        params: [{
            key: 'title',
            value: val
        }]
      })
      .subscribe(res => {
        this.items = res.nodes;
      });
    }
  }

  searchTerm(item) {
    this.viewCtrl.dismiss({
      term: item.title
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
