import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { RequestOptions } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { UserRegister } from '../pages/user-register/user-register';
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
import { ModalGeolocation } from '../pages/modal-geolocation/modal-geolocation';
import { ModalSearch } from '../pages/modal-search/modal-search';
import { ModalManageImages } from '../pages/modal-manage-images/modal-manage-images';
import { MoreOptionsPopoverPage } from '../pages/more-options-popover/more-options-popover';
import { MoreInfoPopoverPage } from '../pages/more-info-popover/more-info-popover';
import { GalleryPage } from '../pages/gallery/gallery';
import { SearchResult } from '../pages/search-result/search-result';

import { Api } from '../providers/api';
import { User } from '../providers/user';
import { DefaultRequestOptions } from '../providers/default-request-options';
import { NodeService } from '../providers/node-service';
import { Taxonomy } from '../providers/taxonomy';
import { FlagService } from '../providers/flag-service';
import { ViewsService } from '../providers/views-service';
import { Neerby } from '../providers/neerby';
import { Util } from '../providers/util';
import { GeolocationService } from '../providers/geolocation-service';
import { CameraService } from '../providers/camera-service';
import { GoogleMaps } from '../providers/google-maps';
import { PushService } from '../providers/push-service';

import { NeboLoadingSpinner } from '../components/nebo-loading-spinner/nebo-loading-spinner';
import { NeboSearch } from '../components/nebo-search/nebo-search';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Diagnostic } from '@ionic-native/diagnostic';
import { Push } from '@ionic-native/push';

let pages = [
  MyApp,
  TabsPage,
  LoginPage,
  UserRegister,
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
  ModalGeolocation,
  ModalSearch,
  ModalManageImages,
  MoreOptionsPopoverPage,
  MoreInfoPopoverPage,
  GalleryPage,
  SearchResult,
  NeboLoadingSpinner,
  NeboSearch
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
    Neerby,
    Util,
    GeolocationService,
    CameraService,
    PushService,
    GoogleMaps,
    StatusBar,
    SplashScreen,
    Geolocation,
    Camera,
    File,
    FilePath,
    Diagnostic,
    Push,
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
    }),
    BrowserModule,
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: entryComponents(),
  providers: providers()
})
export class AppModule {}
