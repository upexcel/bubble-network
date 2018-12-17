import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss']
})
export class ChatsPage implements OnInit {
  chatRooms: any;
  searchString = '';
  loader = true;
  constructor(
    public actionSheetController: ActionSheetController,
    private nav: NavController,
    private _chatService: ChatService
  ) { }

  ngOnInit() {
    console.log('ngOnInit');
    this._chatService.getUserChatRooms().subscribe(rooms => {
      this.chatRooms = rooms;
      this.loader = false;
      console.log(rooms);
    });
  }

  goToChatRoom(chatRoom) {
    this._chatService.selectedChatRoomData = chatRoom;
    this.nav.navigateForward(['/chats', chatRoom['id']], true);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Add Friend',
          icon: 'add-circle-outline',
          handler: () => {
            this.nav.navigateForward(['user', { outlets: { 'friends': ['friends'] } }], true);
          }
        },
        {
          text: 'Add Group',
          icon: 'add-circle-outline',
          handler: () => {
            this.nav.navigateForward(['add-group'], true);
          }
        }
      ]
    });
    await actionSheet.present();
  }

  async presentChatActions(event, chatRoom) {
    event.stopPropagation();

    const actionSheet = await this.actionSheetController.create({
      header: 'Options',
      buttons: [
        {
          text: 'Pin Chat',
          icon: 'attach',
          handler: () => {
            console.log('Share clicked');
          }
        },
        {
          text: 'Remove Chat',
          icon: 'remove-circle',
          handler: () => {
            this._chatService.deleteChatRoom(chatRoom);
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
