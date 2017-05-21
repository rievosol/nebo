import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ModalController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { Api } from '../../providers/api';
import { Taxonomy } from '../../providers/taxonomy';
import { ModalGeolocation } from '../modal-geolocation/modal-geolocation';

/*
  Generated class for the OrganizationEditForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-organization-edit-form',
  templateUrl: 'organization-edit-form.html'
})
export class OrganizationEditFormPage {

  @ViewChild(Content) content: Content;

  private form: FormGroup;
  private action: string;
  private nid: number;
  public buttonText: string;
  public pageTitle: string;
  public categoryOptions: any[];
  public state: string;
  public position: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public api: Api,
              public taxonomy: Taxonomy,
              public modalCtrl: ModalController) {
    
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      category: [''],
      phone: [''],
      latitude: [''],
      longitude: ['']
    });
    this.state = 'loading';
    this.nid = this.navParams.get('nid');
    this.action = 'create';
    this.buttonText = 'Create';
    this.pageTitle = 'Create New Organization';
    this.categoryOptions = [];
  }

  ionViewDidLoad() {
    let stream = this.taxonomy.getTerms({
      parameters: {
        vid: this.taxonomy.getVid(this.api.systemData.field_info_fields.field_category_organization.settings.allowed_values[0].vocabulary)
      }
    })
    .map(terms => {
      this.categoryOptions = terms;
    });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Organization';

      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.form.controls['title'].setValue(node.title);

            let body = node.body.und ? node.body.und[0].value : '';
            this.form.controls['body'].setValue(body);

            let category = node.field_category_organization.und ? node.field_category_organization.und[0].tid : '';
            this.form.controls['category'].setValue(category);

            let phone = node.field_phone.und ? node.field_phone.und[0].value : '';
            this.form.controls['phone'].setValue(phone);

            let position = node.field_position.und ? node.field_position.und[0] : { lat: '', lon: ''};
            this.position = {
              latitude: position.lat,
              longitude: position.lon
            };
          });
      })
      .subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
      });
    }
    else {
      stream.subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
      });
    }
  }

  save() {
    let input = this.form.value;
    let node: any = {
      type: 'organization',
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      field_category_organization: {
        und: { tid: input.category }
      },
      field_phone: {
        und: [{ value: input.phone }]
      },
      field_position: {
        und: [{ geom: { lat: this.position.latitude, lon: this.position.longitude }}]
      }
    };

    if (this.action == 'update') {
      node.nid = this.nid;
    }
    
    this.nodeService.save(node).subscribe(data => {
      this.navCtrl.pop();
    });
  }

  setLocation() {
    let modal = this.modalCtrl.create(ModalGeolocation);
    modal.onDidDismiss(position => {
      if (position) {
        console.log(position);
        this.position = position.data;
      }
    });
    modal.present();
  }

}
