import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { App, ActionSheetController, ToastController, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

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
  fileUrl: string = this.api.serviceUrl + '/file';

  constructor(public appCtrl: App,
              public http: Http,
              public api: Api,
              public user: User,
              public views: ViewsService,
              public actionSheetCtrl: ActionSheetController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private file: File) {
    
  }

  load(nid: number) {
    return this.http.get(this.nodeUrl + '/' + nid + '.json')
      .map(res => res.json());
  }

  /**
   * @todo for nodes with image fields, new images need to be uploaded to server first,
   * then retrieve the file ID to be included in node field inputs. then save the node
   * as per normal.
   * @param node 
   */
  public save(node: any) {
    let loading = this.loadingCtrl.create({ content: 'Saving...' });
    loading.present();
    
    let toast = this.toastCtrl.create({
      message: 'Content successfully ' + (node.nid ? 'updated' : 'created'),
      duration: 3000,
      position: 'bottom'
    });

    return this.saveFiles(node)
      .flatMap(res => {
        return this.saveNode(res).map(data => {
          loading.dismiss();
          toast.present();
          return data;
        })
      });
  }

  /**
   * the actual node saving happens here.
   * @param node 
   * @param token 
   */
  private saveNode(node: any) {
    console.log(node);
    return this.api.getToken()
      .flatMap(token => {
        let headers = new Headers({
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        });
        let options = new RequestOptions({ headers: headers });
        let stream;
        
        if (node.nid) {
          stream = this.http.put(this.nodeUrl + '/' + node.nid + '.json', node, options);
        }
        else {
          stream = this.http.post(this.nodeUrl + '.json', node, options);
        }
        return stream.map(res => res.json());
    });
  }

  private saveFiles(node: any) {
    let imageFields = {};
    let fields = this.api.field_info_instances('node', node.type);
    let streams: any[] = [];
    for (let name in fields) {
      if (fields[name].widget.type == 'image_image') {
        if (node[name] && node[name]['und'] && (node[name]['und'].length > 0)) {
          imageFields[name] = [];
          let stream = Observable.from(node[name]['und'])
            .concatMap(file => {
              if (!file['fid'] && file['unsaved']) {
                file['nodeType'] = node.type;
                file['fieldName'] = name;
                return this.saveFile(file).map(savedFile => {
                  return savedFile.fid;
                });
              }
              else {
                return Observable.of(file['fid']);
              }
            })
            .map(fid => {
              imageFields[name].push({
                fid: fid
              });
            });
          streams.push(stream);
        }
      }
    }
    
    if (!streams.length) {
      return Observable.of(node);
    }
    return Observable.forkJoin(streams).map(() => {
      for (let name in imageFields) {
        node[name]['und'] = imageFields[name];
      }
      return node;
    });
  }
  
  private saveFile(file: any) {
    let _file;
    return this.prepareFile(file)
      .flatMap(preparedFile => {
        _file = preparedFile;
        return this.api.getToken();
      })
      .flatMap(token => {
        let headers = new Headers({
          'Content-Type': 'application/json',
          'X-CSRF-Token': token
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.fileUrl + '.json', _file, options)
          .map(res => res.json());
      });
  }

  private prepareFile(file: any) {
    let subject = new Subject();
    let field = this.api.field_info_instances('node', file.nodeType, file.fieldName)
    this.file.readAsDataURL(file.directory, file.fileName).then(imageData => {
      let data = imageData.substr(imageData.indexOf(',') + 1);
      subject.next({
        file: data,
        filename: file.fileName,
        filepath: 'public://' + field.settings.file_directory + '/' + file.fileName
      });
      subject.complete();
    });
    return subject;
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
