import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  NavController,
  LoadingController,
  ToastController,
  AlertController
  // normalizeURL
} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

declare var window;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  step = 1;
  repeatPassword = '';
  signupData: any = {};

  imageURI: any = 'assets/empty-picture.png';

  constructor(
    private nav: NavController,
    private camera: Camera,
    public loadingController: LoadingController,
    public toastCtrl: ToastController,
    public alertController: AlertController,
    private fb: FormBuilder,
    private authService: AuthService,
    private cangeRef: ChangeDetectorRef
  ) {
    this.signupForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  ngOnInit() {
    this.renewSignupForm();
  }

  change() {
    console.log(this.signupData);
  }

  public changeStep(step: number) {
    this.step = step;
  }

  public async register() {
    if (!this.signupForm.valid) {
      console.log(this.signupForm.value);
    } else {
      const loadingElement = await this.loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent'
      });
      await loadingElement.present();

      this.authService
        .signupUser(this.signupForm.value.email, this.signupForm.value.password)
        .then(
          userData => {
            this.step = 2;
            loadingElement.dismiss();
            this.signupForm.reset();
            this.cangeRef.detectChanges();
          },
          async err => {
            loadingElement.dismiss();
            const alert = await this.alertController.create({
              message: err,
              buttons: [
                {
                  text: 'Ok',
                  handler: () => {
                    this.step = 1;
                    alert.dismiss();
                    console.log(err, this.step);
                  }
                }
              ]
            });
            await alert.present();
          }
        );
    }
  }

  public async finishRegistration() {
    const loadingElement = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent'
    });
    await loadingElement.present();

    this.authService
      .updateUser(
        this.signupData.firstName,
        this.signupData.lastName,
        this.signupData.username,
        this.signupData.gender,
        this.signupData.country,
        this.signupData.birthday,
        this.signupData.websiteLink
      )
      .then(
        userData => {
          this.nav.navigateForward(['main'], true);
          this.renewSignupForm();
          loadingElement.dismiss();
          this.signupForm.reset();
          this.step = 1;
        },
        async err => {
          loadingElement.dismiss();
          const alert = await this.alertController.create({
            message: err,
            buttons: [
              {
                text: 'Ok',
                handler: () => {
                  this.step = 1;
                  alert.dismiss();
                }
              }
            ]
          });
          await alert.present();
        }
      );
  }

  public navigate(link: string) {
    this.step = 1;
    this.renewSignupForm();
    this.nav.navigateForward(['welcome/' + link], true);
  }

  getImage() {
    const options: CameraOptions = {
      quality: 100,
      targetWidth: 600,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(
      imageData => {
        this.imageURI = window.Ionic.WebView.convertFileSrc(imageData);
        // this.sanitize.bypassSecurityTrustUrl(imageData);
      },
      err => {
        console.log(err);
        alert(err);
      }
    );
  }

  async acceptTerms() {
    const message =
      'I agree not to post any nude photos, harass, or bully anyone. We will not sell your information nor let in any 3rd party under any terms.';
    const alert = await this.alertController.create({
      header: 'Terms of Use',
      message,
      buttons: [
        {
          text: 'I accept terms of use',
          handler: () => {
            this.register();
          }
        }
      ]
    });

    await alert.present();
  }

  renewSignupForm() {
    this.signupData = {
      firstName: '',
      lastName: '',
      username: '',
      birthday: '',
      gender: '',
      country: '',
      websiteLink: '',
      profilePicture: '',
      bannerPicture: ''
    };
    this.repeatPassword = '';
  }
}
