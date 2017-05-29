import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, reorderArray, ActionSheetController } from 'ionic-angular';
import { CameraService } from '../../providers/camera-service';

/**
 * Generated class for the ModalManageImages page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-modal-manage-images',
  templateUrl: 'modal-manage-images.html',
})
export class ModalManageImages {

  images: any[] = [];

  constructor(public navParams: NavParams,
              public viewCtrl: ViewController,
              public actionSheetCtrl: ActionSheetController,
              public cameraService: CameraService) {
    this.images = navParams.get('images');
  }

  ionViewDidLoad() {
    
  }

  reorder(indexes) {
    this.images = reorderArray(this.images, indexes);
  }

  add() {
    this.cameraService.takePicture().subscribe(file => {
      this.images.push(file);
    });
  }

  done() {
    this.viewCtrl.dismiss({
      images: this.images
    });
  }

  remove(i) {
    this.images.splice(i, 1);
  }

}
