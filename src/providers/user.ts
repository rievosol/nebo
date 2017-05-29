import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MenuController, ToastController, LoadingController } from 'ionic-angular';

import { Api } from './api';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

@Injectable()
export class User {
  
  user: any;
  isAuthenticated: boolean = false;
  nodePermissions: any;
  loginUrl: string = this.api.serviceUrl + '/user/login';
  logoutUrl: string = this.api.serviceUrl + '/user/logout';
  registerUrl: string = this.api.serviceUrl + '/user/register';
  
  constructor(public http: Http,
              public api: Api,
              public menuCtrl: MenuController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
  }

  bootstrap() {
    this.user = this.api.systemData.user;
    this.nodePermissions = this.api.systemData.content_types_user_permissions;
    this.isAuthenticated = this.isUserAuthenticated();
    this.updateMenu();
  }

  login(account: any) {
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.api.getToken()
      .flatMap(res => {
        if (res.error) {
          return Observable.of(res);
        }
        return this.userLogin(account, res);
      })
      .flatMap(res => {
        if (res.error) {
          return Observable.of(res);
        }
        return this.api.connect();
      })
      .flatMap(res => {
        loading.dismiss();
        if (res.error) {
          return Observable.of(res);
        }
        this.bootstrap();
        let toast = this.toastCtrl.create({
          message: 'Welcome back, ' + res.user.name,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        return Observable.of(res.user);
      });
  }

  private userLogin(account: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.loginUrl, account, options)
      .catch(err => {
        let error: any = {
          error: {
            login: err
          }
        };
        return Observable.of(error);
      })
      .map(res => {
        if (res.error) {
          return res;
        }
        return res.json();
      });
  }

  logout() {
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.api.getToken()
      .flatMap(res => {
        if (res.error) {
          return Observable.of(res);
        }
        return this.userLogout(res);
      })
      .flatMap(res => {
        loading.dismiss();
        if (res.error) {
          return Observable.of(res);
        }
        let toast = this.toastCtrl.create({
          message: 'Logout successful',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        return Observable.of('OK');
      });
  }

  private userLogout(token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.logoutUrl, null, options)
      .catch(err => {
        let error: any = {
          error: {
            logout: err
          }
        }
        return Observable.of(error);
      })
      .map(res => {
        console.log(res);
        if (res.error) {
          return res;
        }
        return res.json();
      });
  }

  register(account: any) {
    let loading = this.loadingCtrl.create();
    loading.present();

    return this.api.getToken()
      .flatMap(token => {
        return this.userRegister(account, token);
      })
      .flatMap(() => {
        return this.api.connect();
      })
      .flatMap(data => {
        this.bootstrap();
        let toast = this.toastCtrl.create({
          message: 'Account successfully created',
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
        loading.dismiss();
        return Observable.of(data.user);
      });
  }

  private userRegister(account: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(this.registerUrl, account, options);
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