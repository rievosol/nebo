import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { User } from '../../providers/user';
import { TabsPage } from '../tabs/tabs';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  private login: FormGroup;

  constructor(public navCtrl: NavController,
              public fb: FormBuilder,
              public user: User) {
    this.login = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  doLogin() {
    let input = this.login.value;
    let account: any = {
      username: input.username,
      password: input.password
    };
    this.user.login(account).subscribe(user => {
      this.navCtrl.setRoot(TabsPage);
    });
  }

}
