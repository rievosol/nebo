import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
//import { BusinessEditFormPage } from '../pages/business-edit-form/business-edit-form';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

/*
  Generated class for the NodeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NodeService {

  nodeUrl: string = this.api.serviceUrl + '/node';

  constructor(public http: Http,
              public api: Api,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    
  }

  getNode(nid: number) {
    return this.http.get(this.nodeUrl + '/' + nid + '.json')
      .map(res => res.json());
  }

  private saveNode(node: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });

    if (node.nid) {
      // update
      return this.http.put(this.nodeUrl + '/' + node.nid + '.json', node, options)
        .map(res => res.json());
    }
    else {
      // create
      return this.http.post(this.nodeUrl + '.json', node, options)
        .map(res => res.json());
    }
  }

  save(node: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      content: 'Saving...'
    });
    loading.present();
    
    let message;
    if (node.nid) {
      message = 'Content successfully updated';
    }
    else {
      message = 'Content successfully created';
    }
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    return this.api.getToken()
      .flatMap(token => {
        return this.saveNode(node, token);
      })
      .flatMap(data => {
        loading.dismiss();
        toast.present();
        return Observable.of(data);
      });
  }

}
