import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams } from 'ionic-angular';
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

  @ViewChild(Content) content: Content;
  
  private type: string = 'announcement';
  private typeText: string = 'Announcement';

  private nid: number;
  private form: FormGroup;
  public action: string;
  public buttonText: string;
  public pageTitle: string;
  public groupOptions: any[];
  public state: string;
  viewPath: string = 'og.audienceOptions';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby) {
    this.form = this.fb.group({
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
    this.pageTitle = 'Create New ' + this.typeText;
  }

  ionViewDidLoad() {
    let stream = this.views.getView(this.viewPath)
      .map(res => {
        this.groupOptions = res.nodes;
      });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update ' + this.typeText;
      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.form.controls['title'].setValue(node.title);

            let body = node.body.und ? node.body.und[0].value : '';
            this.form.controls['body'].setValue(body);

            let group = node.og_group_ref.und ? node.og_group_ref.und[0].target_id : '';
            this.form.controls['group'].setValue(group);
          });
      })
      .subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
      });
    }
    else {
      this.form.controls['publishPeriod'].setValidators(Validators.required);
      stream.subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
      });
    }
  }

  save() {
    let input = this.form.value;
    let node: any = {
      type: this.type,
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

    this.nodeService.save(node).subscribe(savedNode => {
      this.navCtrl.pop();
    });
  }

}
