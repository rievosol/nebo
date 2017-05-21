import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserRegister } from './user-register';

@NgModule({
  declarations: [
    UserRegister,
  ],
  imports: [
    IonicPageModule.forChild(UserRegister),
  ],
  exports: [
    UserRegister
  ]
})
export class UserRegisterModule {}
