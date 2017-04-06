import { Component } from '@angular/core';
import { App, NavParams, ViewController } from 'ionic-angular';
import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';

/*
  Generated class for the MoreOptionsPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-more-options-popover',
  templateUrl: 'more-options-popover.html'
})
export class MoreOptionsPopoverPage {

  canEdit: boolean;
  nid: string;

  constructor(public appCtrl: App,
              public navParams: NavParams,
              public viewCtrl: ViewController) {}

  ngOnInit() {
    if (this.navParams.data) {
      this.canEdit = this.navParams.data.canEdit;
      this.nid = this.navParams.data.nid;
    }
  }

  editNode() {
    this.viewCtrl.dismiss();
    this.appCtrl.getRootNav().push(BusinessEditFormPage, { nid: this.nid });
  }

}
