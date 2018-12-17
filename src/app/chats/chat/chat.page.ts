import { Component, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../chat.service';
import { Content } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatPage implements OnInit {
  chatRoomId: string;
  chat = [];
  chatRoomData: any;
  message: string;
  messages = [];
  firstTimeOpening = true;
  @ViewChild(Content) content: Content;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _chatService: ChatService,
    private changeDetectRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.chatRoomId = this.activatedRoute.snapshot.paramMap.get('id');
    this.chatRoomData = this._chatService.selectedChatRoomData;
    this._chatService.getRoomMessages(this.chatRoomId).valueChanges().subscribe(messages => {
      this.messages = messages;
      this.changeDetectRef.detectChanges();
      if (this.firstTimeOpening) {
        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 300);
      } else {
        setTimeout(() => {
          this.content.scrollToBottom(300);
        }, 100);
      }
    });
  }

  sendMessage() {
    const message = this.message.trim();
    if (message.length) {
      this._chatService.sendMessage({
        message: message,
        chatRoomId: this.chatRoomId
      }).then(res => {
      });
      this.message = '';
    }
  }

  eventHandler(e) {
    if (e === 13) {
      this.sendMessage();
    }
  }

  trackByFn(index, item) {
    return index; // or item.id
  }
}
