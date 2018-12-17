import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';

import { CommonComponentsModule } from './common/common.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainContainerPage } from './main-page/main-container/main-container.page';
import { SigninComponent } from './authentification/signin/signin.component';
import { SignupComponent } from './authentification/signup/signup.component';
import { PassRecoveryComponent } from './authentification/pass-recovery/pass-recovery.component';
import { LoggedInGuard } from './authentification/loddeg-in.guard';
import { LoggedOutGuard } from './authentification/logged-out.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FollowersPage } from './user/followers/followers.page';
import { FollowingsPage } from './user/followings/followings.page';
import { AllBubblierPage } from './user/allbubblier/allbubblier.page';
import { NewBubblePostComponent } from './common/new-bubble-post/new-bubble-post';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from './authentification/auth.service';

// firbase
import { Firebase } from '@ionic-native/firebase/ngx';
import { FcmProvider } from './common/fcm.service';

// AF2 Settings
const firebaseConfig = {
  apiKey: 'AIzaSyCNJ2L_Txv77xTPiuqBQiakYkwvxCz05Ew',
  authDomain: 'bubbleflix-edc8d.firebaseapp.com',
  databaseURL: 'https://bubbleflix-edc8d.firebaseio.com',
  projectId: 'bubbleflix-edc8d',
  storageBucket: 'bubbleflix-edc8d.appspot.com',
  messagingSenderId: '173384717347'
};

@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    PassRecoveryComponent,
    MainContainerPage,
    FollowersPage,
    FollowingsPage,
    AllBubblierPage,
    NewBubblePostComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonComponentsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LoggedInGuard,
    LoggedOutGuard,
    Camera,
    AuthService,
    ImagePicker,
    Crop,
    File,
    Firebase,
    FcmProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
