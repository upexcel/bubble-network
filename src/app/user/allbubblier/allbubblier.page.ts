import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { UserService } from '../services/user.service';
@Component({
    selector: 'app-allbubblier',
    templateUrl: './allbubblier.page.html',
    styleUrls: ['./allbubblier.page.scss'],
})
export class AllBubblierPage implements OnInit {
    users = [];
    userFriends = [];
    searchString = '';
    loader = false;
    userFollowing = [];
    constructor(
        private _userService: UserService,
        private actionSheetController: ActionSheetController
    ) {
    }

    ngOnInit() {
        this.getUserFriends();
        this.loader = true;
    }

    async getAllUsers() {
        try {
            this._userService.getAllUser().subscribe(users => {
                this.users = this.formatUsersList(users);
                this.loader = false;
            });
        } catch (e) {
            console.log(e);
            this.loader = false;
        }
    }

    getUserFriends() {
        this._userService.getUserFriends().subscribe(friends => {
            this.userFriends = friends;
            this.getUserFollowing();
        });
    }

    getUserFollowing() { // get user's following list
        this._userService.getUserFollowing().subscribe(following => {
            this.userFollowing = following;
            this.getAllUsers();
        });
    }

    addFriend(user) {
        console.log(user);
        this._userService.addFriend({
            userId: this._userService.loggedInUserData['uid'],
            friendId: user['key']
        });
        if (!user['isFollowing']) {
            this.followUser(user);
        }
    }

    followUser(user) {
        console.log(user);
        if (user['isFollowing']) {
            this._userService.unFollowUser(user);
        } else {
            this._userService.followUser({
                userId: this._userService.loggedInUserData['uid'],
                followUserId: user['key']
            });
        }
    }

    formatUsersList(users) {
        users = users.filter((user) => user.key !== this._userService.loggedInUserData['uid']); // remove logged in user
        // console.log('users', users)
        // console.log('following', this.userFollowing)
        const finalUsers = [];
        users.forEach((user) => {
            const index = this.userFriends.findIndex(friend => friend.friendId === user.key); // remove user's friends from list
            const followIndex = this.userFollowing.findIndex(follow => follow.followUserId === user.key); // change follow or not follow
            if (followIndex !== -1) {
                user['isFollowing'] = true;
                user['followKey'] = this.userFollowing[followIndex].followKey;
            } else {
                user['isFollowing'] = false;
            }
            if (index === -1) {
                finalUsers.push(user);
            }
        });
        console.log('finalUsers', finalUsers)
        return finalUsers;
    }
}
