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
        business: base + '/testing-business-listing.json', // testing
        organization: base + '/testing-organization-listing.json'
      },
      favorites: {
        business: base + '/favorites-business.json',
        organization: base + '/favorites-organization.json',
        all: base + '/favorites-all.json'
      },
      og: {
        audienceOptions: base + '/og-group-audience-options.json'
      },
      user: {
        ownContent: base + '/users-contents.json'
      },
      search: {
        autocomplete: base + '/nebo-autocomplete.json',
        nearby: base + '/search-nearby.json'
      },
      node: {
        children: base + '/entity-child-nodes.json'
      }
    };
  }

  getView(path: string, options?: any) {
    let url = this.getUrl(path);
    if (url) {
      let proceed = true;
      let useInfiniteScroll = false;
      let hasParams = false;

      if (options) {
        // Using contextual filters
        if (options.append) {
          for (let i = 0; i < options.append.length; i++) {
            url += '/' + options.append[i];
          }
        }
        
        // Using views filters
        if (options.params && options.params.length > 0) {
          hasParams = true;
          url += '?';
          for (let i = 0; i < options.params.length; i++) {
            url += options.params[i].key + '=' + options.params[i].value + '&';
          }
          url = url.slice(0, -1);
        }
        
        // Using infinite scroll
        if (options.data && options.data.pages) {
          useInfiniteScroll = true;
          if (options.data.page + 1 < options.data.pages) {
            url += (hasParams ? '&' : '?') + 'page=' + (options.data.page + 1);
          }
          // No more data to fetch.
          else {
            if (options.scroll) {
              options.scroll.enable(false);
            }
            proceed = false;
          }
        }
      }
      
      // Done preparing url, so proceed.
      if (proceed) {
        return this.http.get(url)
          .map(res => {
            let result = res.json();
            if (useInfiniteScroll) {
              if (options.scroll) {
                options.scroll.complete();
                if (result.view.page + 1 == result.view.pages) {
                  options.scroll.enable(false);
                }
              }
            }
            return result;
          });
      }
      return Observable.of({ done: true });
    }
    return Observable.throw('invalid path');
  }

  getViews(pathObj: any[]) {
    let streams = [];
    for (let i = 0; i < pathObj.length; i++) {
      let stream = this.getView(pathObj[i].path)
        .map(data => {
          let res = {};
          res[pathObj[i].key] = data;
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
