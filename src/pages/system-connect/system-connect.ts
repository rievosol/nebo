import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Api } from '../../providers/api';
import { User } from '../../providers/user';

import { HighlightsPage } from '../highlights/highlights';

/*
  Generated class for the SystemConnect page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-system-connect',
  templateUrl: 'system-connect.html'
})
export class SystemConnectPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public api: Api,
              public user: User) {}

  ionViewDidLoad() {
    this.api.connect().subscribe(data => {
      console.log(data);
      this.user.bootstrap();
      this.navCtrl.setRoot(HighlightsPage);
    });
  }

}
