import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { BrowseBusinessPage } from '../browse-business/browse-business';
import { BrowseOrganizationPage } from '../browse-organization/browse-organization';
import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';
import { OrganizationEditFormPage } from '../organization-edit-form/organization-edit-form';
import { AnnouncementEditFormPage } from '../announcement-edit-form/announcement-edit-form';
import { EventEditFormPage } from '../event-edit-form/event-edit-form';

/*
  Generated class for the Browse page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html'
})
export class BrowsePage {

  gotoBusiness: any;
  gotoOrganization: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public actionSheetCtrl: ActionSheetController) {
    this.gotoBusiness = BrowseBusinessPage;
    this.gotoOrganization = BrowseOrganizationPage;
  }

  addContent() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Create content',
      buttons: [
        {
          text: 'Business',
          handler: () =>  this.navCtrl.push(BusinessEditFormPage)
        },
        {
          text: 'Organization',
          handler: () => this.navCtrl.push(OrganizationEditFormPage)
        },
        {
          text: 'Announcement',
          handler: () => this.navCtrl.push(AnnouncementEditFormPage)
        },
        {
          text: 'Event',
          handler: () => this.navCtrl.push(EventEditFormPage)
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
  }

}
