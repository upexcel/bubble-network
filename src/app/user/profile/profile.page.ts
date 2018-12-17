import { Component, OnInit, OnDestroy } from '@angular/core';
import { BubblePostService } from '../../common/bubble-post.service';
import { UserService } from '../../user/services/user.service';
import { concat, uniqBy } from 'lodash';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit, OnDestroy {
  getUserFollowingSubscription: any;
  getUserBubblePostsSubscription: any;
  userFollowingBubblePost = [];
  constructor(
    private _userService: UserService,
    private _bubblePostService: BubblePostService
  ) { }

  ngOnInit() {
    this.getUserFollowing();
  }

  getUserFollowing() { // get user's following list
    this.getUserFollowingSubscription = this._userService.getUserFollowing().subscribe(following => {
      this.getUserFollowingBubblePost(following);
    });
  }

  ngOnDestroy() {
    this.getUserFollowingSubscription.unsubscribe();
    if (this.getUserBubblePostsSubscription) {
      this.getUserBubblePostsSubscription.unsubscribe();
    }
  }

  getUserFollowingBubblePost(following) {
    let count = 0;
    const callback = () => {
      if (count === following.length) {
        this.userFollowingBubblePost = uniqBy(this.userFollowingBubblePost, 'id');
        count = 0;
      } else {
        this.getUserBubblePostsSubscription = this._bubblePostService.
          getUserBubblePosts(following[count]['followUserId']).subscribe(posts => {
            this.userFollowingBubblePost = concat(this.userFollowingBubblePost, posts);
            ++count;
            callback();
          });
      }
    };
    callback();
  }

}