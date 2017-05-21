import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { GeolocationService } from '../../providers/geolocation-service';

/**
 * Generated class for the ModalGeolocation page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-geolocation',
  templateUrl: 'modal-geolocation.html',
})
export class ModalGeolocation {

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public geolocationService: GeolocationService) {

  }

  ionViewDidLoad() {
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getLocation() {
    this.viewCtrl.dismiss({
      data: this.geolocationService.position
    });
  }

}
