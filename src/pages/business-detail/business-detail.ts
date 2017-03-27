import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { NodeService } from '../../providers/node-service';
import { BusinessEditFormPage } from '../business-edit-form/business-edit-form';

/*
  Generated class for the BusinessDetail page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-business-detail',
  templateUrl: 'business-detail.html'
})
export class BusinessDetailPage {

  title: string;
  body: string;
  canEdit: boolean = false;
  private _nid: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public http: Http,
              public nodeService: NodeService) {}

  ionViewDidEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios'
    });
    loading.present();

    let nid = this.navParams.get('nid');
    this._nid = nid;
    this.nodeService.getNode(nid).subscribe(node => {
      loading.dismiss();
      this.title = node.title;
      this.body = node.body.und ? node.body.und[0].value : '';
      this.canEdit = this.nodeService.checkPermissionEdit(node);
    });
  }

  editNode() {
    this.navCtrl.push(BusinessEditFormPage, {nid: this._nid});
  }

  private checkPermissionEdit(node) {
    console.log(node);
  }

}
