import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalSearch } from './modal-search';

@NgModule({
  declarations: [
    ModalSearch,
  ],
  imports: [
    IonicPageModule.forChild(ModalSearch),
  ],
  exports: [
    ModalSearch
  ]
})
export class ModalSearchModule {}
