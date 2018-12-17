import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Component, ApplicationRef, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
    ActionSheetController,
    Platform,
    AlertController,
    LoadingController,
    NavController,
    ModalController,
    ToastController
} from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../user/services/user.service';
import { FirebaseService } from '../../authentification/firebase.service';
import { BubblePostService } from '../bubble-post.service';
@Component({
    selector: 'new-bubble-post',
    templateUrl: 'new-bubble-post.html'
})
export class NewBubblePostComponent implements OnInit {
    image: any;
    description: any;
    strImage: any;
    constructor(
        public navCtrl: NavController,
        private imagePicker: ImagePicker,
        private camera: Camera,
        private actionSheetCtrl: ActionSheetController,
        private platform: Platform,
        private alertCtrl: AlertController,
        private crop: Crop,
        private file: File,
        private loadingCtrl: LoadingController,
        private ref: ApplicationRef,
        public sanitizer: DomSanitizer,
        private modalController: ModalController,
        private userService: UserService,
        private firebaseService: FirebaseService,
        public toastController: ToastController,
        private _bubblePostService: BubblePostService,
        private _location: Location
    ) { }

    async ngOnInit() {
        if (!this.platform.is('cordova')) {
            const alert = await this.alertCtrl.create({
                header: 'Oops! Can"t load an image at this moment!',
                buttons: [{
                    text: 'Finish',
                    role: 'close'
                }],
                cssClass: 'swapx-alert'
            });
            await alert.present();
        } else {
            this.onClick();
        }
    }

    async post() {
        const loadingElement = await this.loadingCtrl.create({
            message: 'Uploading Please wait...',
            spinner: 'crescent'
        });
        await loadingElement.present();
        this.firebaseService.uploadImage(this.strImage, `${new Date().valueOf()}-${this.userService.loggedInUserData.uid}`)
            .then(async res => {
                this._bubblePostService.addNewPost({
                    url: res,
                    description: this.description,
                    author: `${this._bubblePostService.user['firstName']} ${this._bubblePostService.user['lastName']}`,
                    authorId: this._bubblePostService.loggedInUserData['uid'],
                    date: new Date().toString(),
                    animationDelay: 0,
                    likes: 0
                }).then(async newPostRes => {
                    this._bubblePostService.addLike(newPostRes['id']);
                    loadingElement.dismiss();
                    const toast = await this.toastController.create({
                        message: 'Uploaded Succefully',
                        duration: 3000
                    });
                    toast.present();
                    this._location.back();
                });
                console.log(res);
            }, (err) => {
                console.log(err);
            });
    }

    async onClick() {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Choose source',
            buttons: [{
                text: 'Upload from library',
                handler: () => {
                    this.uploadFromLibrary();
                }
            }, {
                text: 'Take a photo',
                handler: () => {
                    this.takePhoto();
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }]
        });
        await actionSheet.present();
    }

    uploadFromLibrary() {
        this.imagePicker.getPictures({
            maximumImagesCount: 1
        }).then((results) => {
            let img = results;
            if (Array.isArray(results)) {
                img = results[0];
            }
            this.cropImage(img);
        }, (err) => {
            console.log(err);
        });
    }

    async takePhoto() {
        const options: CameraOptions = {
            quality: 40,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            allowEdit: true
        };

        this.camera.getPicture(options).then((image) => {
            this.cropImage(image);
        }, async (err) => {
            const alert = await this.alertCtrl.create({
                // title: 'Error',
                message: err,
                buttons: [{
                    text: 'Close',
                    role: 'close'
                }],
                cssClass: 'swapx-alert'
            });
            await alert.present();
        });
    }

    async cropImage(uri: string) {
        this.crop.crop(uri, { quality: 100, targetWidth: -1, targetHeight: -1 }).then(async newImage => {
            const files = [];
            const loading = await this.loadingCtrl.create({
                message: 'Optimizing...',
                duration: 5000
            });
            await loading.present();
            try {
                this.file.resolveLocalFilesystemUrl(newImage).then((entry: any) => {
                    try {
                        entry.file((file: any) => {
                            try {
                                const reader = new FileReader();
                                reader.readAsDataURL(file);
                                reader.onloadend = (event: any) => {
                                    this.image = this.sanitizer.bypassSecurityTrustResourceUrl(event.target.result);
                                    console.log(event.target.result.length);

                                    this.strImage = event.target.result.split(',')[1];

                                    this.ref.tick();
                                    loading.dismiss();
                                };
                                reader.onerror = function (error) {
                                    console.log('IMAGE ERROR: ', error);
                                };

                            } catch (error) {
                                console.log('entry.file');
                                console.log(error);
                                loading.dismiss();
                            }
                        });
                    } catch (error) {
                        console.log('resolveLocalFilesystemUrl');
                        console.log(error);
                        loading.dismiss();
                    }
                });
            } catch (error) {
                console.log('crop.crop');
                console.log(error);
                loading.dismiss();
            }
        });
    }

    close() {
        this._location.back();
    }
}
