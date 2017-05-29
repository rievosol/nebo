import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
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
              public user: User,
              public alertCtrl: AlertController) {
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
    this.user.login(account).subscribe(res => {
      if (res.error) {
        let alert = this.alertCtrl.create({
          title: 'Login failed',
          message: 'Please check your username & password and try again.',
          buttons: ['OK']
        });
        alert.present();
      }
      else {
        this.navCtrl.setRoot(TabsPage);
      }
    });
  }

}
