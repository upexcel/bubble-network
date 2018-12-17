import { Component, OnInit } from '@angular/core';
import {
  MediaCapture,
  MediaFile,
  CaptureError,
  CaptureVideoOptions
} from '@ionic-native/media-capture/ngx';

@Component({
  selector: 'app-live-video',
  templateUrl: './live-video.page.html',
  styleUrls: ['./live-video.page.scss']
})
export class LiveVideoPage implements OnInit {
  mainButton = 'radio-button-on';

  constructor(private mediaCapture: MediaCapture) {}

  ngOnInit() {}

  toggleRecording() {
    let options: CaptureVideoOptions = { limit: 1 };
    this.mediaCapture
      .captureVideo(options)
      .then(
        (data: MediaFile[]) => console.log(data),
        (err: CaptureError) => console.error(err)
      );
  }
}
