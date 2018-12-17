import { Component, OnInit, OnDestroy } from '@angular/core';
import { BubblePostService } from '../../common/bubble-post.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.page.html',
  styleUrls: ['./main-container.page.scss']
})
export class MainContainerPage implements OnInit, OnDestroy {
  allBubblePostsSubscription: any;
  allBubblePost = [];
  constructor(
    private _bubblePostService: BubblePostService
  ) { }

  ngOnInit() {
    this.getAllBubblePost();
  }

  getAllBubblePost() {
    this.allBubblePostsSubscription = this._bubblePostService.getAllBubblePosts().subscribe(res => {
      this.allBubblePost = res;
    });
  }

  ngOnDestroy() {
    this.allBubblePostsSubscription.unsubscribe();
  }

}
