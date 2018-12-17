import { Component, OnInit } from '@angular/core';
import { NavController, PopoverController, LoadingController, AlertController } from '@ionic/angular';
import { ChangeBubblesPage } from '../change-bubbles/change-bubbles.page';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { UserService } from '../services/user.service';
import { FirebaseService } from '../../authentification/firebase.service';
import { AuthService } from '../../authentification/auth.service';
declare var window;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {
  user = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '*****',
    birthday: '',
    gender: '',
    profileImage: '',
    bannerImage: '',
    country: '',
    websiteLink: ''
  };

  constructor(
    private nav: NavController,
    public popoverCtrl: PopoverController,
    private camera: Camera,
    private _userService: UserService,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private _firebaseService: FirebaseService,
    private _authService: AuthService
  ) { }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    try {
      this._userService.getUser().subscribe(user => {
        this.user = user;
        this.user['password'] = '*******';
        this.user['email'] = this._userService.loggedInUserData['email'];
        console.log(this.user);
      });
    } catch (e) {
      console.log(e);
    }
  }

  public async updateUser() {
    const loadingElement = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();

    this._userService
      .updateUser(
        this.user.firstName,
        this.user.lastName,
        this.user.username,
        this.user.gender,
        this.user.country,
        this.user.birthday,
        this.user.websiteLink
      )
      .then(
        userData => {
          loadingElement.dismiss();
        },
        async err => {
          loadingElement.dismiss();
          const alert = await this.alertController.create({
            message: err,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  alert.dismiss();
                }
              }
            ]
          });
          await alert.present();
        }
      );
  }

  signOut() {
    localStorage.removeItem('token');
    this._authService.logoutUser();
    setTimeout(() => {
      this.nav.navigateForward(['welcome'], true);
    }, 0);
  }

  async openChangeBubbles() {
    const fileData = { user: this.user };
    const popover = await this.popoverCtrl.create({
      component: ChangeBubblesPage,
      componentProps: { ...fileData, popoverController: this.popoverCtrl },
      translucent: true
    });
    popover.onDidDismiss().then(() => {
      // this.activateBubbles();
    });
    return await popover.present();
  }


  async changeBanner() {
    const base64 = await this.captureImage();
    const loadingElement = await this.loadingController.create({
      message: 'Uploading Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();
    this._firebaseService.uploadImage(base64, `${this._userService.loggedInUserData['uid']}-banner`).then(url => {
      this._userService.updateUserBannerImage(url).then(res => {
        loadingElement.dismiss();
      });
    });
  }

  async getImage() {
    const base64 = await this.captureImage();
    const loadingElement = await this.loadingController.create({
      message: 'Uploading Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();
    this._firebaseService.uploadImage(base64, `${this._userService.loggedInUserData['uid']}-profile`).then(url => {
      this._userService.updateUserImage(url).then(res => {
        loadingElement.dismiss();
      });
    });
  }

  async captureImage() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA
    };

    return await this.camera.getPicture(options);
  }
}
