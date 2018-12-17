import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController } from '@ionic/angular';
import { UserService } from '../../user/services/user.service';
import { ChatService } from '../../chats/chat.service';
@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.page.html',
  styleUrls: ['./add-group.page.scss'],
})
export class AddGroupPage {
  friends: any;
  searchString = '';
  groupName = '';
  loader = false;
  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private _userService: UserService,
    private _chatService: ChatService
  ) {
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
    console.log('Begin async operation', infiniteScroll);
    infiniteScroll.target.complete();
  }

  async presentActionSheet(chatId) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Message',
          icon: 'text',
          handler: () => {
            this.nav.navigateForward(['/chats', chatId], true);
          }
        },
        {
          text: 'Remove from Friends',
          role: 'destructive',
          icon: 'remove-circle',
          handler: () => {
            console.log('Delete clicked');
          }
        }
      ]
    });
    await actionSheet.present();
  }

  createGroup() {
    console.log(this.friends);
    console.log(this.groupName);
    const groupName = this.groupName.trim();
    if (!groupName || !groupName.length) {
      return;
    }
    const selectedFriends = [this._userService.loggedInUserData['uid']];
    this.friends.forEach(friend => {
      console.log(friend);
      if (friend['isChecked']) {
        selectedFriends.push(friend['friendId']);
      }
    });
    this._chatService.addRoom({
      users: selectedFriends,
      roomName: this.groupName,
      type: 'group',
      time: new Date().toString()
    }).then(res => {
      console.log(res);
      this._chatService.selectedChatRoomData = {
        roomName: this.groupName
      };
      this.nav.navigateForward(['/chats', res['id'] || res[0]['id']], true);
    }, (err) => {
      console.log(err);
    });
  }

}
