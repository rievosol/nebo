import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalGeolocation } from './modal-geolocation';

@NgModule({
  declarations: [
    ModalGeolocation,
  ],
  imports: [
    IonicPageModule.forChild(ModalGeolocation),
  ],
  exports: [
    ModalGeolocation
  ]
})
export class ModalGeolocationModule {}
