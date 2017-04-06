import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { App, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
import { User } from './user';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';

/*
  Generated class for the NodeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NodeService {

  nodeUrl: string = this.api.serviceUrl + '/node';

  constructor(public appCtrl: App,
              public http: Http,
              public api: Api,
              public user: User,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    
  }

  load(nid: number) {
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

  checkPermissionEdit(node) {
    let perm = this.user.nodePermissions[node.type];
    if (perm['edit any']) {
      return true;
    }
    else if (perm['edit own'] && (node.uid == this.user.user.uid)) {
      return true;
    }
    else {
      return false;
    }
  }

  getChildNodes(node) {
    let nodes = {
      announcement: [],
      event: [],
      promotion: []
    };
    return this.http.get(this.api.url + '/entity_child_nodes.json/' + node.nid)
      .map(res => {
        let data = res.json();
        for (let item of data.nodes) {
          nodes[item.type].push(item);
        }
        return nodes;
      });
  }
 
}
