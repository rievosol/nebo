import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalManageImages } from './modal-manage-images';

@NgModule({
  declarations: [
    ModalManageImages,
  ],
  imports: [
    IonicPageModule.forChild(ModalManageImages),
  ],
  exports: [
    ModalManageImages
  ]
})
export class ModalManageImagesModule {}
