import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';

import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';

/*
  Generated class for the Highlights page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-highlights',
  templateUrl: 'highlights.html'
})
export class HighlightsPage {

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController) {}

  addContent() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Create content',
      buttons: [
        {
          text: 'Business',
          handler: () => {
            console.log('create business');
            this.navCtrl.push(BusinessEditFormPage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
