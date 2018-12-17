import { Component } from '@angular/core';

import { Platform, NavController, MenuController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './authentification/auth.service';
import { FcmProvider } from './common/fcm.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private _authService: AuthService,
    private fcm: FcmProvider,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initFcm();
    });
  }

  async initFcm() {
    // Get a FCM token
    this.fcm.getToken();

    // Listen to incoming messages
    this.fcm.listenToNotifications().pipe(
      tap(async msg => {
        // show a toast
        const toast = await this.toastCtrl.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
      })
    )
      .subscribe();
  }

  signOut() {
    localStorage.removeItem('token');
    this._authService.logoutUser();
    this.menuCtrl.close();
    setTimeout(() => {
      this.navCtrl.navigateForward(['welcome'], true);
    }, 0);
  }
}
