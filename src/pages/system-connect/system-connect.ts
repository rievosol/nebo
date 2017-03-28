import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Api } from '../../providers/api';
import { User } from '../../providers/user';
import { Taxonomy } from '../../providers/taxonomy';

import { TabsPage } from '../tabs/tabs';

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
              public user: User,
              public taxonomy: Taxonomy,
              public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    this.api.connect().subscribe(data => {
      console.log(data);
      if (data.error) {
        let alertOptions: any = {
          title: 'Connection failed',
          buttons: ['OK']
        };
        if (data.error.getToken) {
          switch (data.error.getToken.status) {
            case 0:
              alertOptions.message = "Are you sure you're connected to the Internet?";
              break;

            case 503:
              alertOptions.title = 'Maintenance break';
              alertOptions.message = "We'll be back shortly.";
              break;

            default:
              alertOptions.message = 'Unexpected problem found.';
          }
        }
        else if (data.error.systemConnect) {
          switch (data.error.systemConnect.status) {
            case 0:
              alertOptions.title = 'Maintenance break';
              alertOptions.message = 'Please login from the website.';
              break;

            default:
              alertOptions.message = 'Please contact administrator.';
          }
        }
        let alert = this.alertCtrl.create(alertOptions);
        alert.present();
      }
      else {
        this.user.bootstrap();
        this.taxonomy.bootstrap();
        this.navCtrl.setRoot(TabsPage);
      }
    },
    err => {
      let alert = this.alertCtrl.create({
        title: 'Connection failed',
        message: 'Are you sure you are connected to the Internet?',
        buttons: ['OK']
      });
      alert.present();
    });
  }

}
