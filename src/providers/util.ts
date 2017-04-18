import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Util provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Util {

  constructor(public http: Http,
              public sanitizer: DomSanitizer) {
    
  }

  sanitize(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
