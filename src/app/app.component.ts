import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Api } from '../providers/api';
import { User } from '../providers/user';

import { LoginPage } from '../pages/login/login';
import { SystemConnectPage } from '../pages/system-connect/system-connect';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyContentPage } from '../pages/my-content/my-content';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';
import { HighlightsPage } from '../pages/highlights/highlights';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SystemConnectPage;

  authPages: Array<{title: string, component: any, icon: string}>;
  anonPages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform,
              public splashScreen: SplashScreen,
              public statusBar: StatusBar,
              public api: Api,
              public user: User,
              public toastCtrl: ToastController ) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.authPages = [
      { title: 'My Account', component: MyAccountPage, icon: 'person' },
      { title: 'My Content', component: MyContentPage, icon: 'folder' },
      { title: 'My Favorites', component: MyFavoritesPage, icon: 'heart' }
    ];

    this.anonPages = [
      { title: 'Login', component: LoginPage, icon: 'exit' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    this.user.logout().subscribe(user => {
      console.log(user);
      this.nav.setRoot(HighlightsPage);
      let toast = this.toastCtrl.create({
        message: 'Successfully logged out',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

}
