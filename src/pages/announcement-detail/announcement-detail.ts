import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';

import { BusinessDetailPage } from '../business-detail/business-detail';
import { OrganizationDetailPage } from '../organization-detail/organization-detail';
import { AnnouncementEditFormPage } from '../announcement-edit-form/announcement-edit-form';
import { MoreInfoPopoverPage } from '../more-info-popover/more-info-popover';
import { NodeService } from '../../providers/node-service';

/*
  Generated class for the AnnouncementDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-announcement-detail',
  templateUrl: 'announcement-detail.html'
})
export class AnnouncementDetailPage {
  
  type: string;
  node: any;
  private _nid: number;
  title: string;
  body: string;
  state: string;
  group: any;
  expireInterval: string;
  canEdit: boolean;
  statusIcon: string = 'eye';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public nodeService: NodeService,
              public popoverCtrl: PopoverController) {
    this.type = 'Announcement';
    this.node = {};
    this.title = navParams.get('title');
  }

  ionViewWillEnter() {
    this.state = 'loading';
  }

  ionViewDidEnter() {
    this._nid = this.navParams.get('nid');
    this.title = this.navParams.get('title');
    this.nodeService.load(this._nid).subscribe(node => {
      console.log(node);
      this.state = 'loaded';
      this.statusIcon = parseInt(node.status) ? 'eye' : 'eye-off';
      this.node = node;
      this.canEdit = this.nodeService.checkPermissionEdit(node);
      this.title = node.title;
      this.body = node.body.und ? node.body.und[0].value : '';
      this.group = node.og_group_ref.und[0];
      this.expireInterval = node.neerby_access_expire_date_interval;
    });
  }

  viewRefNode() {
    let params = {
      nid: this.group.target_id,
      title: this.group.title
    };
    switch (this.group.bundle) {
      case 'business':
        this.navCtrl.push(BusinessDetailPage, params);
        break;

      case 'organization':
        this.navCtrl.push(OrganizationDetailPage, params);
        break;
    }
  }

  viewMoreInfo(ev) {
    let popover = this.popoverCtrl.create(MoreInfoPopoverPage, {
      node: this.node
    });
    popover.present({
      ev: ev
    });
  }

  editNode() {
    this.navCtrl.push(AnnouncementEditFormPage, { nid: this._nid });
  }

}
