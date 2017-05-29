import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ModalController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { ViewsService } from '../../providers/views-service';
import { CameraService } from '../../providers/camera-service';
import { Neerby } from '../../providers/neerby';
import { GoogleMaps } from '../../providers/google-maps';
import { ModalGeolocation } from '../modal-geolocation/modal-geolocation';

declare var google: any;

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
  @ViewChild('map') mapElement: ElementRef;
  
  private type: string = 'event';
  private typeText: string = 'Event';

  private nid: number;
  private form: FormGroup;
  public state: string;
  public action: string;
  public buttonText: string;
  public pageTitle: string;
  public groupOptions: any[];
  viewPath: string = 'og.audienceOptions';
  position: any = null;
  originalPosition: any = null;
  images: any[] = [];
  hasLocation: boolean = false;
  locationName: string;
  geoPoint: string;
  newLocationIsSet: boolean = false;
  addLocationBtn: string = 'Add location';
  addPicturesBtn: string = 'Add pictures';
  minDate: any;
  minFinishDate: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby,
              public modalCtrl: ModalController,
              public cameraService: CameraService,
              public googleMaps: GoogleMaps,
              private zone: NgZone) {

    let tomorrow = this.getMinDate();
    this.minFinishDate = this.minDate = tomorrow.substr(0, 10);
    this.form = fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      group: ['', Validators.required],
      start: [tomorrow, Validators.required],
      finish: [tomorrow, Validators.required],
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

            let start = node.field_date.und ? this.toLocalIso(node.field_date.und[0].value) : '';
            this.minDate = this.minFinishDate = start.substr(0, 10);
            let finish = '';
            if (node.field_date.und && node.field_date.und[0].value2) {
              finish = this.toLocalIso(node.field_date.und[0].value2);
            }
            this.form.controls['start'].setValue(start);
            this.form.controls['finish'].setValue(finish);
            
            let phone = node.field_phone.und ? node.field_phone.und[0].value : '';
            this.form.controls['phone'].setValue(phone);
            
            if (node.field_position.und) {
              this.position = node.field_position.und[0];
              this.position.latitude = this.position.lat;
              this.position.longitude = this.position.lon;
              this.addLocationBtn = 'Modify';
              this.originalPosition = this.position;
            }

            this.images = node.field_image.und ? node.field_image.und : [];
            if (this.images.length > 0) {
              this.addPicturesBtn = 'Modify';
            }
          });
      })
      .subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
        this.previewLocation();
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
      type: this.type,
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      og_group_ref: { 
        und: input.group 
      },
      field_phone: {
        und: [{ value: input.phone }]
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

    if (this.position) {
      node.field_position = {
        und: [{
          geom: {
            lat: this.position.latitude,
            lon: this.position.longitude
          }
        }]
      };
    }

    if (this.images.length) {
      node.field_image = {
        und: this.images
      };
    }

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
    return _date;
  }

  updateDate(date, element) {
    let dateTime = date.year + '-';
    dateTime += (date.month > 9 ? date.month : '0' + date.month) + '-';
    dateTime += (date.day > 9 ? date.day : '0' + date.day) + 'T';
    dateTime += (date.hour > 9 ? date.hour : '0' + date.hour) + ':';
    dateTime += (date.minute > 9 ? date.minute : '0' + date.minute) + ':';
    dateTime += (date.second > 9 ? date.second : '0' + date.second) + 'Z';
    
    switch(element) {
      case 'start':
        this.minFinishDate = dateTime.substr(0, 10);        
        if (new Date(this.form.value.finish).getTime() < new Date(dateTime).getTime()) {
          this.form.controls['finish'].setValue(dateTime);
        }
        break;
      
      case 'finish':
        if (new Date(dateTime).getTime() < new Date(this.form.value.start).getTime()) {
          this.form.controls['start'].setValue(dateTime);
        }
        break;
    }
  }

  getMinDate() {
    let min = new Date();
    min.setDate(min.getDate() + 1);
    return this.toLocalIso(min.toISOString());
  }

  setLocation() {
    let modal = this.modalCtrl.create(ModalGeolocation);
    modal.onDidDismiss(passedData => {
      if (passedData) {
        this.position = passedData.data;
        this.newLocationIsSet = this.originalPosition ? true : false;
        this.addLocationBtn = 'Modify';
        this.previewLocation();
      }
    });
    modal.present();
  }

  previewLocation() {
    if (this.position) {
      this.googleMaps.geocode(this.position).subscribe(res => {
        let names = res['names'];
        this.geoPoint = parseFloat(this.position.latitude) + ', ' + parseFloat(this.position.longitude); 
        this.zone.run(() => {
          this.locationName = (names['sublocality'] ? names['sublocality'] + ', ' : '') + names['locality'];
        });
        let latlng = new google.maps.LatLng(this.position.latitude, this.position.longitude);
        let map = new google.maps.Map(this.mapElement.nativeElement, {
          center: latlng,
          zoom: 15
        });
        let marker = new google.maps.Marker({
          position: latlng
        });
        marker.setMap(map);
        google.maps.event.trigger(map, 'resize');
      });
    }
  }

  revertOriginalLocation() {
    this.position = this.originalPosition;
    this.previewLocation();
    this.newLocationIsSet = false;
  }

  getPictureMethod() {
    this.cameraService.takePicture().subscribe(file => {
      file['unsaved'] = true;
      this.images.push(file);
    });
  }

}
