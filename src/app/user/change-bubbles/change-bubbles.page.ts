import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  NavParams,
  PopoverController,
  ActionSheetController,
  AlertController
} from '@ionic/angular';
import { BubblePostService } from '../../common/bubble-post.service';
@Component({
  selector: 'app-change-bubbles',
  templateUrl: './change-bubbles.page.html',
  styleUrls: ['./change-bubbles.page.scss']
})
export class ChangeBubblesPage implements OnInit {
  pop: PopoverController;
  bubbles = [];
  getUserBubblePostsSub: any;
  loader = true;
  constructor(
    navParams: NavParams,
    public actionSheetController: ActionSheetController,
    private _bubblePostService: BubblePostService,
    private _alertCtrl: AlertController
  ) {
    this.pop = navParams.get('popoverController');
  }

  ngOnInit() {
    this.getUserBubblePostsSub = this._bubblePostService.getUserBubblePosts().subscribe(bubbles => {
      this.loader = false;
      this.bubbles = bubbles;
    });
  }

  close() {
    this.pop.dismiss();
    console.log('close');
    this.getUserBubblePostsSub.unsubscribe();
  }

  async presentActionSheet(bubble) {
    console.log('bubble', bubble)
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Edit title',
          icon: 'brush',
          handler: () => {
            console.log('Share clicked');
            this.changeBubblePostDescription(bubble);
          }
        },
        {
          text: 'Remove Bubble',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            console.log('Delete clicked');
            this.deletePost(bubble);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async deletePost(bubble) {
    const alert = await this._alertCtrl.create({
      header: 'Confirm!',
      message: 'Are you <strong>Sure</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            this._bubblePostService.deleteBubblePost(bubble);
          }
        }
      ]
    });

    await alert.present();
  }

  async changeBubblePostDescription(bubble) {
    const alert = await this._alertCtrl.create({
      header: 'New Name',
      inputs: [
        {
          type: 'text',
          value: bubble['description'],
          placeholder: 'Please enter new name'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (e) => {
            this._bubblePostService.updateBubble(bubble['id'], {
              description: e[0]
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
