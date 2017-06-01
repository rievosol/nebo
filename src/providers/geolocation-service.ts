import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
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

  constructor(public geolocation: Geolocation,
              public diagnostic: Diagnostic,
              public alertCtrl: AlertController) {
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

  getPosition(options?: any, test?: boolean) {
    options = options || {};
    let minAccuracy = options.minAccuracy || 30; // 30 meters
    let waitTime = options.waitTime || 30000; // 30 seconds
    let savedPosition = this.lastSavedPosition;
    let subject = new Subject();
    
    // This is for testing, using dummy position data.
    if (test) {
      setTimeout(function() {
        subject.next({
          latitude: 3.126897,
          longitude: 101.340926
        });
      }, 1000);
    }
    else {
      if (window['cordova']) {
        this.diagnostic.isLocationEnabled()
          .then(enabled => {
            if (!enabled) {
              let alert = this.alertCtrl.create({
                title: 'Your GPS on?',
                message: 'To get an accurate location, your GPS must be activated.',
                buttons: ['OK']
              });
              alert.present();
            }
          });
      }

      let timeout = setTimeout(() => {
        savedPosition = savedPosition || null;
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
    }
    return subject;
  }

  createFilterString(position, range?: number) {
    range = range || 10; // default range is 10km.
    return position.latitude + ',' + position.longitude + '_' + range;
  }
  
  /**
   * Calculate distance between 2 points using haversine formula.
   * @param lat1 
   * @param lon1 
   * @param lat2 
   * @param lon2 
   * @param unit 
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit: string) {
    let radlat1 = Math.PI * lat1/180;
    let radlat2 = Math.PI * lat2/180;
    let theta = lon1 - lon2;
    let radtheta = Math.PI * theta/180;
    let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    switch (unit) {
      case 'K': // Kilometers
        dist = dist * 1.609344;
        break;

      case 'N': // Nautica miles
        dist = dist * 0.8684;
        break;
    }
    return dist;
  }

  calculateDistanseFromCurrentLocation(target: any, test?: boolean) {
    target.latitude = target.latitude || target.lat;
    target.longitude = target.longitude || target.lon;
    test = test || null;
    return this.getPosition(null, test).map(current => {
      return this.calculateDistance(current['latitude'], current['longitude'], target.latitude, target.longitude, 'K');
    });
  }

}
