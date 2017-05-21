import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ModalController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { ViewsService } from '../../providers/views-service';
import { Neerby } from '../../providers/neerby';
import { ModalGeolocation } from '../modal-geolocation/modal-geolocation';

/*
  Generated class for the EventEditForm page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-event-edit-form',
  templateUrl: 'event-edit-form.html'
})
export class EventEditFormPage {

  @ViewChild(Content) content: Content;

  private nid: number;
  private form: FormGroup;
  public state: string;
  public action: string;
  public buttonText: string;
  public pageTitle: string;
  public groupOptions: any[];
  viewPath: string = 'og.audienceOptions';
  public position: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby,
              public modalCtrl: ModalController) {
    let now = this.toLocalIso(new Date().toISOString());
    this.form = fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      group: ['', Validators.required],
      start: [now, Validators.required],
      finish: [now, Validators.required],
      phone: [''],
      latitude: [''],
      longitude: [''],
      publishPeriod: ['']
    });
    this.groupOptions = [];
    this.state = 'loading';
    this.nid = this.navParams.get('nid');
    this.action = 'create';
    this.buttonText = 'Create';
    this.pageTitle = 'Create New Event';
  }

  ionViewDidLoad() {
    let stream = this.views.getView(this.viewPath)
      .map(res => {
        this.groupOptions = res.nodes;
      });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Event';
      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.form.controls['title'].setValue(node.title);
            
            let body = node.body.und ? node.body.und[0].value : '';
            this.form.controls['body'].setValue(body);

            let group = node.og_group_ref.und ? node.og_group_ref.und[0].target_id : '';
            this.form.controls['group'].setValue(group);

            let start = node.field_date.und ? this.toLocalIso(node.field_date.und[0].value) : '';
            let finish = '';
            if (node.field_date.und && node.field_date.und[0].value2) {
              finish = this.toLocalIso(node.field_date.und[0].value2);
            }
            this.form.controls['start'].setValue(start);
            this.form.controls['finish'].setValue(finish);
            
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

    let start = this.getDateTime(input.start);
    let finish = this.getDateTime(input.finish);

    let node: any = {
      type: 'event',
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      og_group_ref: { und: input.group },
      field_phone: {
        und: [{ value: input.phone }]
      },
      field_position: {
        und: [{ geom: { lat: this.position.latitude, lon: this.position.longitude }}]
      },
      field_date: {
        und: [{
          value: {
            date: start['date'],
            time: start['time']
          },
          value2: {
            date: finish['date'],
            time: finish['time']
          }
        }]
      }
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

  getDateTime(input) {
    let dateTime = this.processDate(input);
    let arr = dateTime.split(' ');
    return arr.length == 2 ? { date: arr[0], time: arr[1] } : null;
  }

  processDate(date) {
    // @todo: Regex should be used here
    date = date.replace('T', ' ');
    return date.slice(0, 16);
  }
 
  /**
   * Convert date string to a localized, ISO-standard one.
   * 
   * @param date Date string in the format of 'YYYY-mm-dd hh:mm' or
   * 'YYYY-mm-ddThh:mm:ssZ', depending on from where the date is obtained.
   * The date needs to be of UTC timezone.
   */
  toLocalIso(date) {
    date = date.trim();
    date = date.replace(' ', 'T');
    // For such case where the date is obtained from Drupal,
    // there would not be 'Z' at the end of the string, so we add one.
    // Normally Drupal stores the date by UTC timezone.
    if (date.charAt(date.length - 1) !== 'Z') {
      date += 'Z';
    }
    let o = new Date().getTimezoneOffset() * 60000;
    let _date = new Date(new Date(date).getTime() - o).toISOString();
    return _date.slice(0, -1);
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
