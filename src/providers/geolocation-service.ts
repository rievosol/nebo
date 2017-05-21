import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';

/*
  Generated class for the GeolocationService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GeolocationService {
  
  position: any;
  continuousWatch: any;
  watchPos: any;
  lastSavedPosition: any;

  constructor(public geolocation: Geolocation) {
    this.watchPos = this.geolocation.watchPosition({
      enableHighAccuracy: true
    });
  }

  start() {
    this.continuousWatch = this.watchPos.subscribe(position => {
      this.position = position.coords;
    });
  }

  stop() {
    this.continuousWatch.unsubscribe();
  }

  getPosition() {
    let minAccuracy = 30; // 30 meters
    let waitTime = 30000; // 30 seconds
    let savedPosition = this.lastSavedPosition;
    let subject = new Subject();

    let timeout = setTimeout(() => {
      subject.next(savedPosition);
      subscription.unsubscribe();
    }, waitTime);

    let subscription = this.watchPos.subscribe(position => {
      console.log(position);
      if (position.coords.accuracy < minAccuracy) {
        clearTimeout(timeout);
        subject.next(position);
        subscription.unsubscribe();
      }
      else if (!savedPosition || (savedPosition && position.coords.accuracy < savedPosition.coords.accuracy)) {
        savedPosition = position;
        this.lastSavedPosition = position;
      }
    });

    return subject;
  }

}
