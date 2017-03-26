import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
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
    console.log('getting token');
    return this.http.get(this.tokenUrl)
      .map(res => {
        let token = res.text();
        console.log(token);
        return token;
      });
  }

  private systemConnect(token) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    console.log('system connect');
    return this.http.post(this.systemConnectUrl, null, options)
      .map(res => {
        let data = res.json();
        this.systemData = data;
        return data;
      });
  }

  public connect() {
    return this.getToken()
      .flatMap(token => {
        return this.systemConnect(token);
      });
  }
}