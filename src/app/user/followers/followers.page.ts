import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.page.html',
  styleUrls: ['./followers.page.scss'],
})
export class FollowersPage implements OnInit {
  followers: any;
  loader = false;
  constructor(
    private _userService: UserService
  ) { }
  ngOnInit() {
    this.getUserFollowers();
  }


  getUserFollowers() { // get user's Followers list
    this.loader = true;
    try {
      this._userService.getUserFollowers().subscribe(followers => {
        this._userService.getUserFollowersWithData(followers).then(followerUsers => {
          console.log(followerUsers);
          this.loader = false;
          this.followers = followerUsers;
        }, err => {
          this.loader = false;
        });
      });
    } catch (e) {
      console.log(e);
    }
  }

}
