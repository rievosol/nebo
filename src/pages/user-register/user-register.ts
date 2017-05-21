import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { User } from '../../providers/user';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the UserRegister page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-register',
  templateUrl: 'user-register.html',
})
export class UserRegister {

  private form: FormGroup;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public user: User) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  register() {
    let input = this.form.value;
    let account: any = {
      username: input.username,
      password: input.password1
    };
    this.user.register(account).subscribe(user => {
      this.navCtrl.setRoot(TabsPage);
    });
  }

}
