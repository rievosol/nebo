import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Api } from './api';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/from';

/*
  Generated class for the Taxonomy provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Taxonomy {

  taxonomyUrl: string = this.api.serviceUrl + '/taxonomy_term';
  vocabularies: any = {};

  constructor(public http: Http,
              public api: Api) {

  }

  bootstrap() {
    Observable.from(this.api.systemData.taxonomy_vocabularies)
      .subscribe(vocab => {
        this.vocabularies[vocab['machine_name']] = vocab;
      });
  }

  getTerms(query: any) {
    let queryString = this.buildQuery(query);
    return this.http.get(this.taxonomyUrl + queryString).map(res => res.json());
  }

  getVid(vocab: string) {
    if (this.vocabularies[vocab]) {
      return this.vocabularies[vocab].vid;
    }
    return null;
  }

  buildQuery(query: any) {
    let queryString = '';
    if (query.fields) {
      let fields: string = '';
      for (let value of query.fields) {
        fields += value + ',';
      }
      queryString += 'fields=' + fields.slice(0, -1) + '&';
    }

    if (query.parameters) {
      for (let key in query.parameters) {
        queryString += 'parameters[' + key + ']=' + query.parameters[key] + '&';
      }
    }
    
    if (queryString) {
      queryString = '?' + queryString.slice(0, -1);
    }
    return queryString;
  }

}
