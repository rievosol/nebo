import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { ViewsService } from '../../providers/views-service';
import { Neerby } from '../../providers/neerby';

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

  private nid: number;
  private form: FormGroup;
  public state: string;
  public action: string;
  public buttonText: string;
  public pageTitle: string;
  public groupOptions: any[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby) {
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
    let stream = this.views.getView('og.audienceOptions')
      .map(options => {
        this.groupOptions = options;
      });

    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update Event';
      stream.flatMap(() => {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.state = 'loaded';
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
        und: [{ geom: { lat: input.latitude, lon: input.longitude }}]
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

}
