import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase/ngx';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../user/services/user.service';

@Injectable()
export class FcmProvider {
    token: string;
    constructor(
        public firebaseNative: Firebase,
        public afs: AngularFirestore,
        private platform: Platform,
        private _userService: UserService
    ) { }

    async getToken() {

        if (this.platform.is('android')) {

            this.token = await this.firebaseNative.getToken();
            console.log('fcmtoken', this.token);
        }

        if (this.platform.is('ios')) {
            this.token = await this.firebaseNative.getToken();
            const perm = await this.firebaseNative.grantPermission();
            console.log('fcmtoken', this.token);
        }

        // Is not cordova == web PWA
        if (!this.platform.is('cordova')) {
            // TODO add PWA support with angularfire2
        }
    }

    saveTokenToFirestore(uid) {
        if (!this.token) {
            return;
        }
        const devicesRef = this.afs.collection('devices');
        const token = this.token;
        const userId = this._userService.loggedInUserData['uid'];
        const docData = {
            token: this.token
        };

        return devicesRef.doc(userId).set(docData);
    }

    listenToNotifications() {
        return this.firebaseNative.onNotificationOpen();
    }

}
