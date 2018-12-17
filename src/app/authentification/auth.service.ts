import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { FcmProvider } from '../common/fcm.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Content-Type': 'application/json',
//     'Authorization': 'key=AAAAKF6I1CM:APA91bFQOrTy9rKhnyKzmpy4Qcw4NI4HQxb32V39HhMWjYfXuE0tsR7Cy1OKLigvdf5pNJhtc1frpB_kTbllHSyKh8HUb1eRHHxhVeIuNemRxTrnctU5BCEJtIyBjADayS2i7qSPkONM'
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private af: AngularFireDatabase,
    private _fcmProvider: FcmProvider,
    private http: HttpClient
  ) {
    this.afAuth.authState.subscribe(data => {
      console.log('auth state change: ', data);
      if (data && data['uid']) {
        setTimeout(() => {
          this._fcmProvider.saveTokenToFirestore(data['uid']);
        }, 2000);
      }
      // setTimeout(() => {
      //   console.log('push')
      //   this.http.post('https://fcm.googleapis.com/fcm/send', {
      //     'notification': {
      //       'title': 'Firebase',
      //       'body': 'Firebase is awesome',
      //       'click_action': 'http://localhost:3000/',
      //       'icon': 'http://url-to-an-icon/icon.png'
      //     },
      //     'to': 'c1nQtWrM8Fc:APA91bG_b4m77kAnb-ScFSGYaK2jRfPCTit7NCFV2prUgfxavLMkdn93vZILS3fJ_QtCijctZGbpF7tdBOw6edWJWjNn2nOeV_SGIyc-HwndeR11Tl5Q2y_wHkKkLRd7J7eCpvgasPB0'
      //   }, httpOptions)
      //     .subscribe(res => {
      //       console.log(res);
      //     }, err => {
      //       console.log(err);
      //     });
      // }, 5000);
    });
  }

  user = null;

  loginUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth
      .signInWithEmailAndPassword(newEmail, newPassword)
      .catch(err => {
        return err;
      });
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signupUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(newEmail, newPassword)
      .then(user => (this.user = user.user))
  }

  updateUser(
    firstName: string,
    lastName: string,
    username: string,
    gender: string,
    country: string,
    birthday: any,
    websiteLink: string
  ) {
    return this.af
      .list('user')
      .update(this.user.uid, {
        firstName,
        lastName,
        username,
        gender,
        country,
        birthday,
        websiteLink
      });
  }
}
