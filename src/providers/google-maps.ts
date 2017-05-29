import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

declare var google: any;

/*
  Generated class for the GoogleMaps provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.

  @todo: Use Observable.create(observer => {}) instead.
*/
@Injectable()
export class GoogleMaps {

  constructor(public http: Http) {

  }
  
  /**
   * This function should return observable.
   */
  geocode(position: any) {
    
    let subject = new Subject();
    let names = {};
    let geocoder = new google.maps.Geocoder;
    let latlng = new google.maps.LatLng(position.latitude, position.longitude);
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status == 'OK') {
        let output = {};
        for (let i = 0; i < results.length; i++) {
          let result = results[i];
          for (let j = 0; j < result.address_components.length; j++) {
            let component = result.address_components[j];
            for (let k = 0; k < component.types.length; k++) {
              let type = component.types[k];
              let name = component.short_name;
              
              output[type] = output[type] || {};
              output[type][name] = output[type][name] ? output[type][name] + 1 : 1;
            }
          }
        }

        for (let type in output) {
          let count = 0;
          for (let name in output[type]) {
            if (output[type][name] > count) {
              names[type] = name;
              count = output[type][name];
            }
          }
        }
      }
      subject.next({ names: names });
      subject.complete();
    });
    return subject;
  }
}
