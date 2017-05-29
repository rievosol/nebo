import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

/**
 * Api is a service to facilitate REST and server connection.
 */
@Injectable()
export class Api {
  
  localhost: string;
  url: string;
  serviceUrl: string;
  tokenUrl: string;
  systemConnectUrl: string;
  systemData: any;

  constructor(public http: Http) {
    this.localhost = window['cordova'] ? 'http://192.168.56.1' : 'http://localhost';
    this.url = this.localhost + '/nebo';
    this.serviceUrl = this.url + '/drupalgap';
    this.tokenUrl = this.url + '/services/session/token';
    this.systemConnectUrl = this.serviceUrl + '/system/connect';
  }

  public getToken() {
    return this.http.get(this.tokenUrl)
      .catch(err => {
        let error: any = {
          error: {
            getToken: err
          }
        };
        return Observable.of(error);
      })
      .map(res => {
        if (res.error) {
          return res;
        }
        let token = res.text();
        return token;
      });
  }

  private systemConnect(token) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.systemConnectUrl, null, options)
      .catch(err => {
        let error: any = {
          error: {
            systemConnect: err
          }
        };
        return Observable.of(error);
      })
      .map(res => {
        if (res.error) {
          return res;
        }
        let data = res.json();
        this.systemData = data;
        return data;
      });
  }

  public connect() {
    return this.getToken()
      .flatMap(res => {
        if (res.error) {
          // this is not token, it's error from getting token
          return Observable.of(res);
        }
        // getting token successful, pass token to systemConnect
        return this.systemConnect(res);
      });
  }

  field_info_instances(type?: string, bundle?: string, name?: string) {
    let info = this.systemData.field_info_instances;
    if (type && info[type]) {
      info = info[type];
      if (bundle && info[bundle]) {
        info = info[bundle];
        if (name && info[name]) {
          info = info[name];
        }
      }
    }
    return info;
  }
}