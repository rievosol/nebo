import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
import { User } from './user';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/forkJoin';

/*
  Generated class for the FlagService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class FlagService {

  flagUrl: string = this.api.serviceUrl + '/flag';
  flagFlagUrl: string = this.flagUrl + '/flag';
  isFlaggedUrl: string = this.flagUrl + '/is_flagged';

  constructor(public http: Http,
              public api: Api,
              public user: User) {
    
  }

  getFlag(node) {
    let flags = [];
    for (let i in this.api.systemData.flag) {
      let flag = this.api.systemData.flag[i];
      if (flag.types.indexOf(node.type) >= 0) {
        flags.push(flag.name);
      }
    }
    return flags;
  }

  private _isFlagged(node: any, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    let flags = this.getFlag(node);
    let streams = [];
    for (let flag of flags) {
      let data = {
        flag_name: flag,
        entity_id: node.nid,
        uid: this.user.user.uid
      };
      let stream = this.http.post(this.isFlaggedUrl, data, options)
        .map(res => {
          let result = res.json();
          return {
            key: flag,
            value: result[0]
          };
        });
      streams.push(stream);
    }
    return Observable.forkJoin(streams);
  }

  isFlagged(node) {
    return this.api.getToken()
      .flatMap(token => {
        return this._isFlagged(node, token);
      });
  }

  flag(node, flagName) {
    if (typeof node.flag[flagName] !== 'undefined') {
      return this.api.getToken()
        .flatMap(token => {
          return this._flag(node, flagName, token);
        });
    }
  }

  private _flag(node: any, flagName: string, token: string) {
    let headers = new Headers({
      'Content-Type': 'application/json',
      'X-CSRF-Token': token
    });
    let options = new RequestOptions({ headers: headers });
    let action = node.flag[flagName] ? 'unflag' : 'flag';
    let data = {
      flag_name: flagName,
      entity_id: node.nid,
      action: action,
      uid: this.user.user.uid
    };

    return this.http.post(this.flagFlagUrl, data, options)
      .map(res => res.json());
  }

}
