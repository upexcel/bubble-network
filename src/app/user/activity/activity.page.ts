import { Component, OnInit } from '@angular/core';
import { BubblePostService } from '../../common/bubble-post.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.page.html',
  styleUrls: ['./activity.page.scss'],
})
export class ActivityPage implements OnInit {
  bubblesStopped = false;
  userBubblePosts: any;
  constructor(
    private _bubblePostService: BubblePostService
  ) {

  }

  async ngOnInit() {
    this._bubblePostService.getAllBubblePosts().subscribe(posts => {
      this.userBubblePosts = posts;
    });
  }
}
