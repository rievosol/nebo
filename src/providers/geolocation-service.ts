import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Geolocation } from '@ionic-native/geolocation';
import 'rxjs/add/operator/map';

/*
  Generated class for the GeolocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeolocationService {
  
  position: any;
  watch: any;

  constructor(public http: Http,
              private geolocation: Geolocation) {
    
  }

  start() {
    this.watch = this.geolocation.watchPosition({
      enableHighAccuracy: true
    })
    .subscribe(position => {
      this.position = position.coords;
    });
  }

  stop() {
    this.watch.unsubscribe();
  }

}
