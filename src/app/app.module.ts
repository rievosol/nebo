import { NgModule, ErrorHandler } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { SystemConnectPage } from '../pages/system-connect/system-connect';
import { HighlightsPage } from '../pages/highlights/highlights';
import { BrowsePage } from '../pages/browse/browse';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyContentPage } from '../pages/my-content/my-content';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';
import { AnnouncementEditFormPage } from '../pages/announcement-edit-form/announcement-edit-form';
import { BusinessEditFormPage } from '../pages/business-edit-form/business-edit-form';
import { EventEditFormPage } from '../pages/event-edit-form/event-edit-form';
import { OrganizationEditFormPage } from '../pages/organization-edit-form/organization-edit-form';
import { PromotionEditFormPage } from '../pages/promotion-edit-form/promotion-edit-form';
import { BrowseBusinessPage } from '../pages/browse-business/browse-business';
import { BrowseOrganizationPage } from '../pages/browse-organization/browse-organization';
import { BusinessDetailPage } from '../pages/business-detail/business-detail';
import { OrganizationDetailPage } from '../pages/organization-detail/organization-detail';
import { AnnouncementDetailPage } from '../pages/announcement-detail/announcement-detail';
import { EventDetailPage } from '../pages/event-detail/event-detail';
import { PromotionDetailPage } from '../pages/promotion-detail/promotion-detail';
import { ModalMapPage } from '../pages/modal-map/modal-map';
import { MoreOptionsPopoverPage } from '../pages/more-options-popover/more-options-popover';
import { GalleryPage } from '../pages/gallery/gallery';

import { Api } from '../providers/api';
import { User } from '../providers/user';
import { DefaultRequestOptions } from '../providers/default-request-options';
import { NodeService } from '../providers/node-service';
import { Taxonomy } from '../providers/taxonomy';
import { FlagService } from '../providers/flag-service';
import { ViewsService } from '../providers/views-service';

import { NeboLoadingSpinner } from '../components/nebo-loading-spinner/nebo-loading-spinner';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let pages = [
  MyApp,
  TabsPage,
  LoginPage,
  SystemConnectPage,
  HighlightsPage,
  BrowsePage,
  MyAccountPage,
  MyContentPage,
  MyFavoritesPage,
  AnnouncementEditFormPage,
  BusinessEditFormPage,
  EventEditFormPage,
  OrganizationEditFormPage,
  PromotionEditFormPage,
  BrowseBusinessPage,
  BrowseOrganizationPage,
  BusinessDetailPage,
  OrganizationDetailPage,
  AnnouncementDetailPage,
  EventDetailPage,
  PromotionDetailPage,
  ModalMapPage,
  MoreOptionsPopoverPage,
  GalleryPage,
  NeboLoadingSpinner
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
    Taxonomy,
    FlagService,
    ViewsService,
    StatusBar,
    SplashScreen,
    { provide: RequestOptions, useClass: DefaultRequestOptions },
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
}

@NgModule({
  declarations: declarations(),
  imports: [
    IonicModule.forRoot(MyApp, {
      tabsHideOnSubPages: true,
      tabsPlacement: 'top',
      tabsHighlight: true
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
