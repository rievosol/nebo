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
  
  url: string = 'http://localhost/nebo';
  serviceUrl: string = this.url + '/drupalgap';
  tokenUrl: string = this.url + '/services/session/token';
  systemConnectUrl: string = this.serviceUrl + '/system/connect';

  systemData: any;

  constructor(public http: Http) {
    
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
}