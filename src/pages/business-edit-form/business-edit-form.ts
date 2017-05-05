import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { Api } from '../../providers/api';
import { Taxonomy } from '../../providers/taxonomy';
import { ModalGeolocation } from '../modal-geolocation/modal-geolocation';

import 'rxjs/add/operator/map';

/*
  Generated class for the BusinessEditForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-business-edit-form',
  templateUrl: 'business-edit-form.html'
})
export class BusinessEditFormPage {
  
  private form: FormGroup;
  private action: string;
  private nid: number;
  public buttonText: string;
  public pageTitle: string;
  public categoryOptions: any[];
  public state: string;
  position: any = {};

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
    this.pageTitle = 'Create New Business';
    this.categoryOptions = [];
  }

  ionViewDidLoad() {
    let stream = this.taxonomy.getTerms({
      parameters: {
        vid: this.taxonomy.getVid(this.api.systemData.field_info_fields.field_category_business.settings.allowed_values[0].vocabulary)
      }
    })
    .map(terms => {
      this.categoryOptions = terms;
    });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Business';

      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.form.controls['title'].setValue(node.title);

            let body = node.body.und ? node.body.und[0].value : '';
            this.form.controls['body'].setValue(body);

            let category = node.field_category_business.und ? node.field_category_business.und[0].tid : '';
            this.form.controls['category'].setValue(category);

            let phone = node.field_phone.und ? node.field_phone.und[0].value : '';
            this.form.controls['phone'].setValue(phone);

            let position = node.field_position.und ? node.field_position.und[0] : { lat: '', lon: ''};
            this.form.controls['latitude'].setValue(position.lat);
            this.form.controls['longitude'].setValue(position.lon);
          });
      })
      .subscribe(() => {
        this.state = 'loaded';
      });
    }
    else {
      stream.subscribe(() => {
        this.state = 'loaded';
      });
    }
  }

  save() {
    let input = this.form.value;
    let node: any = {
      type: 'business',
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      field_category_business: {
        und: { tid: input.category }
      },
      field_phone: {
        und: [{ value: input.phone }]
      },
      field_position: {
        und: [{ 
          geom: { 
            lat: this.position.latitude || '', 
            lon: this.position.longitude || ''
          }
        }]
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
        this.position = position;
      }
    });
    modal.present();
  }
}
