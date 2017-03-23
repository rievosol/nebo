import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

/**
 * Api is a service to facilitate REST and server connection.
 */
@Injectable()
export class Api {
  
  url: string = 'http://localhost/nebo';
  serviceUrl: string = this.url + '/drupalgap';
  tokenUrl: string = this.url + '/services/session/token';
  systemConnectUrl: string = this.serviceUrl + '/system/connect';

  constructor(public http: Http) {
    
  }

  private getToken() {
    return this.http.get(this.tokenUrl)
      .map(res => res.text());
  }

  private systemConnect(token) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });

    return this.http.post(this.systemConnectUrl, null, options)
      .map(res => res.json());
  }

  public connect() {
    return this.getToken()
      .flatMap(token => this.systemConnect(token));
  }
}