import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MenuController } from 'ionic-angular';

import { Api } from './api';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

@Injectable()
export class User {
  
  user: any;
  isAuthenticated: boolean = false;
  loginUrl: string = this.api.serviceUrl + '/user/login';
  
  constructor(public http: Http,
              public api: Api,
              public menuCtrl: MenuController) {
  }

  bootstrap() {
    this.user = this.api.systemData.user;
    this.isAuthenticated = this.isUserAuthenticated();
    this.updateMenu();
  }

  login(account: any) {
    return this.api.getToken()
      .flatMap(token => {
        return this.userLogin(account, token);
      })
      .flatMap(() => {
        return this.api.connect();
      })
      .flatMap(data => {
        this.bootstrap();
        return Observable.of(data.user);
      });
  }

  private userLogin(account: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    console.log('logging in');
    return this.http.post(this.loginUrl, account, options);
  }

  enableAuthenticatedMenu() {
    this.menuCtrl.enable(true, 'authenticated');
  }

  enableAnonymousMenu() {
    this.menuCtrl.enable(true, 'anonymous');
  }

  private isUserAuthenticated() {
    return this.user.uid == '0' ? false : true;
  }

  updateMenu() {
    if (this.isAuthenticated) {
      this.enableAuthenticatedMenu();
    }
    else {
      this.enableAnonymousMenu();
    }
  }
}