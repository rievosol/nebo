import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ActionSheetController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

/*
  Generated class for the CameraService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CameraService {

  constructor(public http: Http,
              public actionSheetCtrl: ActionSheetController,
              public platform: Platform,
              private camera: Camera,
              private file: File,
              private filePath: FilePath) {
    
  }

  private selectSource() {
    let subject = new Subject();
    let action = this.actionSheetCtrl.create({
      title: 'Select source',
      buttons: [
        {
          text: 'Browse Library',
          handler: () => {
            subject.next('library');
          }
        },
        {
          text: 'Snap a Photo',
          handler: () => {
            subject.next('camera');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    action.present();
    return subject;
  }

  takePicture(source? : string) {
    let subject = new Subject();
    this.selectSource().subscribe(source => {
      let sourceType;
      switch (source) {
        case 'library':
          sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
          break;
        
        case 'camera':
        default:
          sourceType = this.camera.PictureSourceType.CAMERA;
          break;
      }

      let options = {
        quality: 100,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: sourceType,
        correctOrientation: true
        //saveToPhotoAlbum: true // got issue
      };

      this.camera.getPicture(options).then(imagePath => {
        if (this.platform.is('android') && sourceType == this.camera.PictureSourceType.PHOTOLIBRARY) {
          this.filePath.resolveNativePath(imagePath).then(file => {
            subject.next({
              url: file,
              directory: file.substr(0, file.lastIndexOf('/') + 1),
              fileName: file.substr(file.lastIndexOf('/') + 1)
            });
          });
        }
        else {
          // picture comes from camera, so we move to a permanent place and get the image from there.
          this.file.resolveLocalFilesystemUrl(imagePath).then(file => {
            let targetDir = this.file.externalApplicationStorageDirectory;
            this.file.moveFile(file.filesystem.root.nativeURL, file.name, targetDir, file.name)
              .then(fileEntry => {
                subject.next({
                  url: fileEntry.nativeURL,
                  directory: targetDir,
                  fileName: fileEntry.name,
                  unsaved: true
                });
              },
              error => {
                subject.error(error);
              });
          });
        }
        
      });
    });
    
    return subject;
  }

}
