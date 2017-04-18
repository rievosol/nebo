import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
import 'rxjs/add/operator/map';

/*
  Generated class for the ViewsService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ViewsService {

  url: any;

  constructor(public http: Http,
              public api: Api) {
    let base = this.api.url;
    this.url = {
      highlights: {
        announcement: base + '/highlights-announcement.json',
        event: base + '/highlights-event.json',
        promotion: base + '/highlights-promotion.json'
      },
      browse: {
        business: base + '/testing-business-listing.json' // testing
      },
      og: {
        audienceOptions: base + '/og-group-audience-options.json'
      }
    };
  }

  getView(path: string) {
    let url = this.getUrl(path);
    if (url) {
      return this.http.get(url)
        .map(res => {
          let data = res.json();
          return data.nodes;
        });
    }
    return Observable.throw('invalid path');
  }

  getViews(pathObj: any[]) {
    let streams = [];
    for (let i = 0; i < pathObj.length; i++) {
      let stream = this.getView(pathObj[i].path)
        .map(nodes => {
          let res = {};
          res[pathObj[i].key] = nodes;
          return res;
        });
      streams.push(stream);
    }
    return Observable.forkJoin(streams)
      .map(res => {
        let obj = {};
        for (let i = 0; i < res.length; i++) {
          Object.assign(obj, res[i]);
        }
        return obj;
      })
  }

  getUrl(path: string) {
    let pathArray = path.split('.');
    let curPath = this.url;
    for (let i = 0; i < pathArray.length; i++) {
      if (curPath) {
        curPath = curPath[pathArray[i]] || '';
      }
    }
    return curPath;
  }

}
