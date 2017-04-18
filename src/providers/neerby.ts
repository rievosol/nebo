import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Api } from './api';
import 'rxjs/add/operator/map';

/*
  Generated class for the Neerby provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Neerby {
  
  periodOptions: any[];
  periodOptionsWD: any[];

  constructor(public http: Http,
              public api: Api) {
    this.periodOptions = [
      { period: 1, label: '1 day' },
      { period: 2, label: '2 days' },
      { period: 3, label: '3 days' },
      { period: 4, label: '4 days' },
      { period: 5, label: '5 days' },
      { period: 6, label: '6 days' },
      { period: 7, label: '7 days' },
      { period: 10, label: '10 days' },
      { period: 14, label: '14 days' },
      { period: 21, label: '21 days' },
      { period: 30, label: '30 days' }
    ];
    this.periodOptionsWD = this.getPeriodOptions();
  }

  getPeriodOptions() {
    let newOptions = [];
    for (let option of this.periodOptions) {
      let date = new Date();
      date.setDate(date.getDate() + option.period);
      let d = date.getDate();
      let m = date.getMonth() + 1;
      let y = date.getFullYear();
      option.label = option.label + ' (' + d + '/' + m + '/' + y + ')';
      newOptions.push(option);
    }
    return newOptions;
  }

}
