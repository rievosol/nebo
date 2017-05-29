import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
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
      savedPosition = savedPosition || {};
      subject.next(savedPosition);
      subscription.unsubscribe();
    }, waitTime);

    let subscription = this.watchPos
      .catch(err => {
        console.log(err);
        let error: any = {
          error: {
            watchPosition: err
          }
        };
        return Observable.of(error);
      })
      .subscribe(res => {
        console.log(res);
        if (res.error || !res.coords) {
          // This is error.
          let error = res.error ? res : { error: res };
          subject.next(error);
        }
        else if (res.coords) {
          let coords = res.coords;
          if (coords.accuracy < minAccuracy) {
            clearTimeout(timeout);
            subject.next(coords);
            subscription.unsubscribe();
          }
          else if (!savedPosition || (savedPosition && coords.accuracy < savedPosition.accuracy)) {
            savedPosition = coords;
            this.lastSavedPosition = coords;
          }
        }
      });
    return subject;
  }

}
