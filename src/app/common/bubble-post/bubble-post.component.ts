import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { BubblePost } from '../../models/bubble-post.interface';
import { NavParams, PopoverController } from '@ionic/angular';
import { BubblePostService } from '../bubble-post.service';
import { findIndex } from 'lodash';
@Component({
  selector: 'app-bubble-post',
  templateUrl: './bubble-post.component.html',
  styleUrls: ['./bubble-post.component.scss']
})
export class BubblePostComponent implements OnInit, OnDestroy {
  @ViewChild('commentArea') commentArea;

  sidebarOpen = false;
  bubblePostLikedByMe = false;
  bubblePostLikedByMeData = false;
  bubblePostData = {};
  newComment = '';
  pop: PopoverController;
  getBubblePostLikesSubscription: any;
  getBubblePostCommentsSubscription: any;
  constructor(
    navParams: NavParams,
    private _bubblePostService: BubblePostService
  ) {
    this.bubblePostData['url'] = navParams.get('url');
    this.bubblePostData['id'] = navParams.get('id');
    this.bubblePostData['description'] = navParams.get('description');
    this.bubblePostData['author'] = navParams.get('author');
    this.bubblePostData['date'] = navParams.get('title');
    this.bubblePostData['comments'] = [];
    this.bubblePostData['likes'] = [];

    this.pop = navParams.get('popoverController');
  }


  ngOnInit() {
    this.getBubblePostLikes();
    this.getBubblePostComments();
  }

  getBubblePostLikes() {
    this.getBubblePostLikesSubscription = this._bubblePostService.getBubblePostLikes(this.bubblePostData['id']).subscribe(res => {
      console.log(res);
      this.bubblePostData['likes'] = res;
      const index = findIndex(res, { user: this._bubblePostService.loggedInUserData['uid'] });
      if (index !== -1) {
        this.bubblePostLikedByMe = true;
        this.bubblePostLikedByMeData = res[index];
      } else {
        this.bubblePostLikedByMe = false;
        this.bubblePostLikedByMeData = null;
      }
    }, err => {
      console.log(err);
    });
  }

  getBubblePostComments() {
    this.getBubblePostCommentsSubscription = this._bubblePostService.getBubblePostComments(this.bubblePostData['id']).subscribe(res => {
      console.log(res);
      this.bubblePostData['comments'] = res;
    }, err => {
      console.log(err);
    });
  }

  likeClick() {
    if (this.bubblePostLikedByMe) {
      this._bubblePostService.removeLike(this.bubblePostData['id'], this.bubblePostLikedByMeData['id']);
      this._bubblePostService.updateLike(this.bubblePostData['id'], this.bubblePostData['likes'].length - 1);
    } else {
      this._bubblePostService.addLike(this.bubblePostData['id']);
      this._bubblePostService.updateLike(this.bubblePostData['id'], this.bubblePostData['likes'].length + 1);
    }
  }

  comment() {
    this._bubblePostService.addComment(this.bubblePostData['id'], {
      time: new Date().toString(),
      text: this.newComment,
      user: `${this._bubblePostService.user['firstName']} ${this._bubblePostService.user['lastName']}`
    });
    this.newComment = '';
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    setTimeout(() => {
      if (this.sidebarOpen) {
        this.commentArea.focus();
      }
    }, 1000);
  }

  close() {
    this.pop.dismiss();
  }

  ngOnDestroy() {
    console.log('ngOnDestroy');
    this.getBubblePostLikesSubscription.unsubscribe();
    this.getBubblePostCommentsSubscription.unsubscribe();
  }
}
