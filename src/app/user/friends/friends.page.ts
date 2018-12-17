import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { ChatService } from '../../chats/chat.service';
@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss']
})
export class FriendsPage implements OnInit {
  friends: any;
  searchString = '';
  loader: boolean;
  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private _userService: UserService,
    private _chatService: ChatService
  ) {
  }

  ngOnInit() {
    this.getUserFriends();
  }

  getUserFriends() {
    try {
      this.loader = true;
      this._userService.getUserFriends().subscribe(friends => {
        this._userService.getUserFriendsWithData(friends).then(data => {
          console.log('friends', data);
          this.friends = data;
          this.loader = false;
        });
      }, (err) => {
        this.loader = false;
      });
    } catch (e) {
      this.loader = false;
      console.log(e);
    }
  }

  doInfinite(infiniteScroll) {
    infiniteScroll.target.complete();
  }

  async presentActionSheet(friend) {
    const actionSheet = await this.actionSheetController.create({
      header: `${friend['firstName']} ${friend['lastName']}`,
      buttons: [
        {
          text: 'Message',
          icon: 'text',
          handler: () => {
            console.log(friend);
            this._chatService.addRoom({
              users: [this._userService.loggedInUserData['uid'], friend['friendId']],
              roomName: `${friend['firstName']} ${friend['lastName']}`,
              type: 'private',
              time: new Date().toString()
            }).then(res => {
              console.log('new room data', res);
              if (res['id']) {
                res['roomName'] = `${friend['firstName']} ${friend['lastName']}`;
                this._chatService.selectedChatRoomData = res;
                this.nav.navigateForward(['/chats', res['id']], true);
              } else {
                this._chatService.selectedChatRoomData = res[0];
                this.nav.navigateForward(['/chats', res[0]['id']], true);
              }
            }, (err) => {
              console.log(err);
            });
          }
        },
        {
          text: 'Remove Friend',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            console.log('Delete clicked');
            this.removeFriend(friend);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  removeFriend(friend) {
    this._userService.removeFriend(friend);
  }

  navigate(link: string) {
    this.nav.navigateForward([link], true);
  }
}
