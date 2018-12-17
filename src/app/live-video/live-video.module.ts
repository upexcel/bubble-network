import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LiveVideoPage } from './live-video.page';

import { MediaCapture } from '@ionic-native/media-capture/ngx';

const routes: Routes = [
  {
    path: '',
    component: LiveVideoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [LiveVideoPage],
  providers: [MediaCapture]
})
export class LiveVideoPageModule {}
