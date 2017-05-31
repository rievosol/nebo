import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { Api } from '../providers/api';
import { User } from '../providers/user';
import { PushService } from '../providers/push-service';

import { LoginPage } from '../pages/login/login';
import { UserRegister } from '../pages/user-register/user-register';
import { SystemConnectPage } from '../pages/system-connect/system-connect';
import { MyAccountPage } from '../pages/my-account/my-account';
import { MyContentPage } from '../pages/my-content/my-content';
import { MyFavoritesPage } from '../pages/my-favorites/my-favorites';


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
              public alertCtrl: AlertController,
              public pushService: PushService) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.authPages = [
      { title: 'My Account', component: MyAccountPage, icon: 'ios-person-outline' },
      { title: 'My Content', component: MyContentPage, icon: 'ios-folder-outline' },
      { title: 'My Favorites', component: MyFavoritesPage, icon: 'ios-heart-outline' }
    ];

    this.anonPages = [
      { title: 'Login', component: LoginPage, icon: 'ios-exit-outline' },
      { title: 'Register', component: UserRegister, icon: 'ios-exit-outline'}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.pushService.init();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  logout() {
    this.user.logout().subscribe(res => {
      if (res.error) {
        let alert = this.alertCtrl.create({
          title: 'Logout failed',
          message: 'Could not log you out. Please contact administrator.',
          buttons: ['OK']
        });
        alert.present();
      }
      else {
        this.nav.setRoot(SystemConnectPage);
      }
    });
  }

}
