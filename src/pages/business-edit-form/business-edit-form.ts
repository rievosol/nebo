import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { Api } from '../../providers/api';
import { Taxonomy } from '../../providers/taxonomy';

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
  
  private businessEdit: FormGroup;
  private _action: string = 'create';
  private _nid: string = '';
  public buttonText: string = 'Create';
  public pageTitle: string = 'Create New Business';
  public categoryOptions: any[] = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public http: Http,
              public api: Api,
              public taxonomy: Taxonomy) {
    
    this.businessEdit = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      category: [''],
      phone: [''],
      latitude: [''],
      longitude: ['']
    });

  }

  ionViewDidLoad() {
    let nid = this.navParams.get('nid');
    if (typeof nid !== 'undefined') {
      this._action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Business';

      this.nodeService.load(nid)
        .flatMap(node => {
          let vocab = this.api.systemData.field_info_fields.field_category_business.settings.allowed_values[0].vocabulary;
          let query = {
            parameters: {
              vid: this.taxonomy.getVid(vocab)
            }
          };
          return this.taxonomy.getTerms(query)
            .map(terms => {
              this.categoryOptions = terms;
              return node;
            });
        })
        .subscribe(node => {
          console.log(node);
          this._nid = node.nid;
          this.businessEdit.controls['title'].setValue(node.title);

          let body = node.body.und ? node.body.und[0].value : '';
          this.businessEdit.controls['body'].setValue(body);

          let category = node.field_category_business.und ? node.field_category_business.und[0].tid : '';
          this.businessEdit.controls['category'].setValue(category);

          let phone = node.field_phone.und ? node.field_phone.und[0].value : '';
          this.businessEdit.controls['phone'].setValue(phone);

          let lat = node.field_position.und ? node.field_position.und[0].lat : '';
          this.businessEdit.controls['latitude'].setValue(lat);

          let lon = node.field_position.und ? node.field_position.und[0].lon : '';
          this.businessEdit.controls['longitude'].setValue(lon);
        });
    }
  }

  saveContent() {
    let input = this.businessEdit.value;
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
        und: [{ geom: { lat: input.latitude, lon: input.longitude }}]
      }
    };

    if (this._action == 'update') {
      node.nid = this._nid;
    }
    
    this.nodeService.save(node).subscribe(data => {
      this.navCtrl.pop();
    });
  }
}
