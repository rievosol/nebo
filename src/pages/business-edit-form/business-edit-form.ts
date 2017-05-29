import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { Api } from '../../providers/api';
import { Taxonomy } from '../../providers/taxonomy';
import { CameraService } from '../../providers/camera-service';
import { GoogleMaps } from '../../providers/google-maps';
import { ModalGeolocation } from '../modal-geolocation/modal-geolocation';
import { ModalManageImages } from '../modal-manage-images/modal-manage-images';
import { GalleryPage } from '../gallery/gallery';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';

declare var google: any;

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

  @ViewChild(Content) content: Content;
  @ViewChild('map') mapElement: ElementRef;
  
  private type: string = 'business';
  private typeText: string = 'Business';
  
  state: string = 'loading';
  buttonText: string = 'Create';
  pageTitle: string = 'Create New ' + this.typeText;
  fieldCategory: string = 'field_category_' + this.type;
  categoryOptions: any[] = [];
  images: any[] = [];
  position: any = null;
  originalPosition: any = null;
  locationName: string;
  geoPoint: string;
  newLocationIsSet: boolean = false;
  addLocationBtn: string = 'Add location';
  addPicturesBtn: string = 'Add pictures';
  profilePicture: any = null;
  originalProfilePicture: any = null;
  profilePictureBtn: string = 'Add Profile Picture';
  newProfilePicIsSet: boolean = false;

  private form: FormGroup;
  private action: string = 'create';
  private nid: number;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public api: Api,
              public taxonomy: Taxonomy,
              public cameraService: CameraService,
              public modalCtrl: ModalController,
              public actionSheetCtrl: ActionSheetController,
              public googleMaps: GoogleMaps,
              private zone: NgZone) {
    
    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      category: [''],
      phone: ['']
    });
    this.nid = this.navParams.get('nid');
    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update ' + this.typeText;
    }
  }

  ionViewDidLoad() {
    this.taxonomy.getTerms({
      parameters: {
        vid: this.taxonomy.getVid(this.api.systemData.field_info_fields[this.fieldCategory].settings.allowed_values[0].vocabulary)
      }
    })
    .flatMap(terms => {
      this.categoryOptions = terms;
      if (this.nid) {
        return this.nodeService.load(this.nid)
          .map(node => {
            this.form.controls['title'].setValue(node.title);

            let body = node.body.und ? node.body.und[0].value : '';
            this.form.controls['body'].setValue(body);
            
            let category = node[this.fieldCategory].und ? node[this.fieldCategory].und[0].tid : '';
            this.form.controls['category'].setValue(category);

            let phone = node.field_phone.und ? node.field_phone.und[0].value : '';
            this.form.controls['phone'].setValue(phone);
            
            if (node.field_position.und) {
              this.position = node.field_position.und[0];
              this.position.latitude = this.position.lat;
              this.position.longitude = this.position.lon;
              this.addLocationBtn = 'Modify';
              this.originalPosition = this.position;
            }

            this.images = node.field_image.und ? node.field_image.und : this.images;
            if (this.images.length > 0) {
              this.addPicturesBtn = 'Modify';
            }
            
            if (node.field_profile_picture.und) {
              this.originalProfilePicture = this.profilePicture = node.field_profile_picture.und[0];
              this.profilePictureBtn = 'Change';
            }
          });
      }
      return Observable.of(null);
    })
    .subscribe(() => {
      this.state = 'loaded';
      this.content.resize();
      this.previewLocation();
    });
  }

  save() {
    let input = this.form.value;
    let node: any = {
      type: this.type,
      title: input.title,
      body: {
        und: [{ value: input.body }]
      },
      field_phone: {
        und: [{ value: input.phone }]
      }
    };

    if (this.profilePicture) {
      node.field_profile_picture = {
        und: [this.profilePicture]
      };
    }

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
    
    node[this.fieldCategory] = {
      und: { tid: input.category }
    };

    if (this.action == 'update') {
      node.nid = this.nid;
    }
    
    this.nodeService.save(node).subscribe(savedNode => {
      this.navCtrl.pop();
    });
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
    if (this.images.length) {
      let modal = this.modalCtrl.create(ModalManageImages, {
        images: this.images
      });
      modal.onDidDismiss(sortedImages => {
        if (sortedImages) {
          this.images = sortedImages.images;
          if (this.images.length == 0) {
            this.addPicturesBtn = 'Add Pictures';
          }
        }
      });
      modal.present();
    }
    else {
      this.cameraService.takePicture().subscribe(file => {
        this.images.push(file);
        this.addPicturesBtn = 'Modify';
      });
    }
  }

  showGallery(index) {
    index = index || 0;
    let gallery = this.modalCtrl.create(GalleryPage, {
      images: this.images,
      start: index
    });
    gallery.present();
  }

  showProfilePicture() {
    let picture = this.modalCtrl.create(GalleryPage, { 
      images: [this.profilePicture],
      start: 0
    });
    picture.present();
  }

  editProfilePicture() {
    this.cameraService.takePicture().subscribe(file => {
      this.profilePicture = file;
      this.newProfilePicIsSet = this.originalProfilePicture ? true : false;
      this.profilePictureBtn = 'Change';
    });
  }

  revertProfilePicture() {
    this.profilePicture = this.originalProfilePicture;
    this.newProfilePicIsSet = false;
  }
}