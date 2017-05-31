import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import 'rxjs/add/operator/map';

/*
  Generated class for the PushService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class PushService {

  constructor(public http: Http,
              public push: Push) {
    
  }

  init() {
    if (window['cordova']) {
      const options: PushOptions = {
        android: {
          senderID: '20344232886'
        }
      };
      const pushObject: PushObject = this.push.init(options);
      pushObject.on('registration').subscribe(res => {
        alert(JSON.stringify(res));
      });
    }
  }

}
