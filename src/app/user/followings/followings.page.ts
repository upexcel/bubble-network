import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-followings',
  templateUrl: './followings.page.html',
  styleUrls: ['./followings.page.scss'],
})
export class FollowingsPage implements OnInit {
  following: any;
  loader = false;
  constructor(
    private _userService: UserService
  ) { }
  ngOnInit() {
    this.getUserFollowing();
  }


  getUserFollowing() { // get user's Followers list
    this.loader = true;
    try {
      this._userService.getUserFollowing().subscribe(following => {
        this._userService.getUserFollowingWithData(following).then(followingUsers => {
          console.log(following);
          this.loader = false;
          this.following = followingUsers;
        }, err => {
          this.loader = false;
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

}
