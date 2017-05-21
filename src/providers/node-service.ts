import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { App, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
import { User } from './user';
import { ViewsService } from './views-service';

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
              public views: ViewsService,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController) {
    
  }

  load(nid: number) {
    return this.http.get(this.nodeUrl + '/' + nid + '.json')
      .map(res => res.json());
  }
  
  /**
   * the actual node saving happens here.
   * @param node 
   * @param token 
   */
  private saveNode(node: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    console.log(node);
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

  /**
   * @todo for nodes with image fields, new images need to be uploaded to server first,
   * then retrieve the file ID to be included in node field inputs. then save the node
   * as per normal.
   * @param node 
   */
  save(node: any) {
    let loading = this.loadingCtrl.create({ content: 'Saving...' });
    loading.present();
    
    let toast = this.toastCtrl.create({
      message: 'Content successfully ' + node.nid ? 'updated' : 'created',
      duration: 3000,
      position: 'bottom'
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
  
  /*
  saveFile(node: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
  }
  */

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

  checkPermissionAdd(types?: string[]) {
    for (let i = 0; i < types.length; i++) {
      let perm = this.user.nodePermissions[types[i]];
      if (!perm['create']) {
        return false;
      }
    }
    return true;
  }

  getNodeTypes(action? : string) {
    let types = ['business', 'organization', 'announcement', 'event'];
    if (action) {
      let out = [];
      for (let i = 0; i < types.length; i++) {
        let type = types[i];
        // More actions can be added such as 'edit any'
        switch (action) {
          case 'create':
            if (this.checkPermissionAdd([type])) {
              out.push(type);
            }
            break;
        }
      }
      return out;
    }
    return types;
  }

  getChildNodes(node) {
    let nodes = {
      announcement: [],
      event: [],
      promotion: []
    };
    return this.views.getView('node.children', {
      append: [node.nid]
    })
    .map(res => {
      for (let item of res.nodes) {
        nodes[item.type].push(item);
      }
      return nodes;
    });
  }
 
}
