import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { ViewsService } from '../../providers/views-service';
import { Neerby } from '../../providers/neerby';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

/*
  Generated class for the AnnouncementEditForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-announcement-edit-form',
  templateUrl: 'announcement-edit-form.html'
})
export class AnnouncementEditFormPage {

  private nid: number;
  private announcementEdit: FormGroup;
  public action: string;
  public buttonText: string;
  public pageTitle: string;
  public groupOptions: any[];
  public state: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby) {
    this.announcementEdit = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      group: ['', Validators.required],
      publishPeriod: ['']
    });
    this.groupOptions = [];
    this.state = 'loading';
    this.nid = this.navParams.get('nid');
    this.action = 'create';
    this.buttonText = 'Create';
    this.pageTitle = 'Create New Announcement';
  }

  ionViewDidLoad() {
    let stream = this.views.getView('og.audienceOptions')
      .map(options => {
        this.groupOptions = options;
      });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Announcement';
      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.state = 'loaded';
            this.announcementEdit.controls['title'].setValue(node.title);

            let body = node.body.und ? node.body.und[0].value : '';
            this.announcementEdit.controls['body'].setValue(body);

            let group = node.og_group_ref.und ? node.og_group_ref.und[0].target_id : '';
            this.announcementEdit.controls['group'].setValue(group);
          });
      })
      .subscribe();
    }
    else {
      this.state = 'loaded';
      this.announcementEdit.controls['publishPeriod'].setValidators(Validators.required);
      stream.subscribe();
    }
  }

  save() {
    let input = this.announcementEdit.value;
    let node: any = {
      type: 'announcement',
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      og_group_ref: { und: input.group }
    };
    
    if (this.action == 'create') {
      node.neerby_access_period = input.publishPeriod;
    }
    if (this.action == 'update') {
      node.nid = this.nid;
    }

    this.nodeService.save(node).subscribe(data => {
      this.navCtrl.pop();
    });
  }

}
