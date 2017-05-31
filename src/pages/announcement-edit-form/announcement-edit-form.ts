import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content, NavController, NavParams, ModalController } from 'ionic-angular';
import { NodeService } from '../../providers/node-service';
import { ViewsService } from '../../providers/views-service';
import { Neerby } from '../../providers/neerby';
import { CameraService } from '../../providers/camera-service';
import { ModalManageImages } from '../modal-manage-images/modal-manage-images';
import { GalleryPage } from '../gallery/gallery';
import { Observable } from 'rxjs/Observable';

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
  public action: string = 'create';
  public buttonText: string = 'Create';
  public pageTitle: string = 'Create New ' + this.typeText;
  public groupOptions: any[] = [];
  public state: string = 'loading';
  viewPath: string = 'og.audienceOptions';
  images: any[] = [];
  addPicturesBtn: string = 'Add pictures';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb: FormBuilder,
              public nodeService: NodeService,
              public views: ViewsService,
              public neerby: Neerby,
              public modalCtrl: ModalController,
              public cameraService: CameraService) {

    this.form = this.fb.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
      group: ['', Validators.required],
      publishPeriod: ['']
    });
    this.nid = this.navParams.get('nid');
    if (this.nid) {
      this.action = 'update';
      this.buttonText = 'Update';
      this.pageTitle = 'Update ' + this.typeText;
    }
  }

  ionViewDidLoad() {

    this.views.getView(this.viewPath)
      .flatMap(res => {
        this.groupOptions = res.nodes;
        if (this.nid) {
          return this.nodeService.load(this.nid)
            .map(node => {
              this.form.controls['title'].setValue(node.title);
              let body = node.body.und ? node.body.und[0].value : '';
              this.form.controls['body'].setValue(body);
              let group = node.og_group_ref.und ? node.og_group_ref.und[0].target_id : '';
              this.form.controls['group'].setValue(group);
            });
        }
        else {
          this.form.controls['publishPeriod'].setValidators(Validators.required);
          return Observable.of(null);
        }
      })
      .subscribe(() => {
        this.state = 'loaded';
        this.content.resize();
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
      og_group_ref: { und: input.group }
    };

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

}
