import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

declare var google: any;

/*
  Generated class for the BusinessDetailMap page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-modal-map',
  templateUrl: 'modal-map.html'
})
export class ModalMapPage {

  @ViewChild('map') mapElement: ElementRef;
  geo: string;
  title: string;

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController) {}

  ionViewDidLoad() {
    let params = this.navParams.data;
    this.title = params.title;
    let position = params.position;
    position.lat = position.lat || position.latitude;
    position.lon = position.lon || position.longitude;
    let latLng = new google.maps.LatLng(position.lat, position.lon);
    let map = new google.maps.Map(this.mapElement.nativeElement, {
      center: latLng,
      zoom: 15
    });
    let marker = new google.maps.Marker({
      position: latLng
    });
    marker.setMap(map);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
