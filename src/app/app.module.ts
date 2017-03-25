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

import { Api } from '../providers/api';
import { User } from '../providers/user';
import { DefaultRequestOptions } from '../providers/default-request-options';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let pages = [
  MyApp,
  LoginPage,
  SystemConnectPage,
  HighlightsPage,
  MyAccountPage,
  MyContentPage,
  MyFavoritesPage
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
