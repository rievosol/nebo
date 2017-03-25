import { NgModule, ErrorHandler } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SystemConnectPage } from '../pages/system-connect/system-connect';
import { HighlightsPage } from '../pages/highlights/highlights';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyContentPage } from '../pages/my-content/my-content';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';
import { AnnouncementEditFormPage } from '../pages/announcement-edit-form/announcement-edit-form';
import { BusinessEditFormPage } from '../pages/business-edit-form/business-edit-form';
import { EventEditFormPage } from '../pages/event-edit-form/event-edit-form';
import { OrganizationEditFormPage } from '../pages/organization-edit-form/organization-edit-form';
import { PromotionEditFormPage } from '../pages/promotion-edit-form/promotion-edit-form';

import { Api } from '../providers/api';
import { User } from '../providers/user';
import { DefaultRequestOptions } from '../providers/default-request-options';
import { NodeService } from '../providers/node-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let pages = [
  MyApp,
  LoginPage,
  SystemConnectPage,
  HighlightsPage,
  MyAccountPage,
  MyContentPage,
  MyFavoritesPage,
  AnnouncementEditFormPage,
  BusinessEditFormPage,
  EventEditFormPage,
  OrganizationEditFormPage,
  PromotionEditFormPage
];

export function declarations() {
  return pages;
}

export function entryComponents() {
  return pages;
}

export function providers() {
  return [
    User,
    Api,
    NodeService,
    StatusBar,
    SplashScreen,
    { provide: RequestOptions, useClass: DefaultRequestOptions },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
