import { Component, OnInit } from '@angular/core';
import { NavController, MenuController } from '@ionic/angular';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit {
  user: any;
  followingCount = 0;
  followerCount = 0;
  constructor(
    private nav: NavController,
    private _userService: UserService,
    private menu: MenuController
  ) { }

  ngOnInit() {
    this.getUserData();
    this.getUserFollowing();
    this.getUserFollowers();
  }

  openMenu() {
    this.menu.open();
  }

  getUserData() {
    try {
      this._userService.getUser().subscribe(user => {
        this.user = user;
      });
    } catch (e) {
      console.log(e);
    }
  }

  getUserFollowing() { // get user's following list
    this._userService.getUserFollowing().subscribe(following => {
      this.followingCount = following.length;
    });
  }

  getUserFollowers() { // get user's Followers list
    this._userService.getUserFollowers().subscribe(followers => {
      console.log(followers);
      this.followerCount = followers.length;
    });
  }

  public navigate(link: string) {
    console.log(link);

    this.nav.navigateForward([link], true);
  }
}
