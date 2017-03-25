import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { User } from '../../providers/user';
import { HighlightsPage } from '../highlights/highlights';

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
              public toastCtrl: ToastController,
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
      console.log(user);
      this.navCtrl.setRoot(HighlightsPage);
      let toast = this.toastCtrl.create({
        message: 'Welcome back, ' + user.name,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

}
