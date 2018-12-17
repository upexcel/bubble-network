import { Component, Input, OnInit } from '@angular/core';
import { BubbleFile } from '../../models/bubble-file.interface';
import { PopoverController, ToastController, NavController, } from '@ionic/angular';
import { BubblePostComponent } from '../bubble-post/bubble-post.component';
import { bubbles } from '../file-data';

@Component({
  selector: 'app-bubbles-container',
  templateUrl: './bubbles-container.component.html',
  styleUrls: ['./bubbles-container.component.scss'],
  entryComponents: [BubblePostComponent]
})
export class BubblesContainerComponent implements OnInit {
  random = Math.random;
  toNumber = Number;
  showedStartToast = false;
  @Input() allBubbles: any;
  fileStorage: BubbleFile[] = [];

  constructor(
    public toastController: ToastController,
    public popoverCtrl: PopoverController
  ) {
  }

  ngOnInit() {
    if (!this.allBubbles) {
      this.allBubbles = bubbles;
    }
    this.allBubbles.forEach(post => {
      post.animationDelay = Math.random() * 6 + 's';
    });
    console.log(this.allBubbles);
  }

  async onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop >=
      event.target.scrollHeight - 100) {
      const toast = await this.toastController.create({
        message: 'Yes, I see your good start!',
        showCloseButton: true,
        duration: 2000,
        position: 'top'
      });
      toast.present();
      this.showedStartToast = true;
    }
  }

  conserveBubbles() {
    this.fileStorage = this.allBubbles;
    this.allBubbles = [];
  }

  activateBubbles() {
    this.allBubbles = this.fileStorage;
    this.fileStorage = [];
  }

  async openBubble(bubble: BubbleFile) {
    this.conserveBubbles();
    const popover = await this.popoverCtrl.create({
      component: BubblePostComponent,
      componentProps: { ...bubble, popoverController: this.popoverCtrl },
      translucent: true
    });
    popover.onDidDismiss().then(() => {
      this.activateBubbles();
    });
    return await popover.present();
  }
}
