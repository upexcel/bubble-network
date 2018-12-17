import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user/services/user.service';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private chatRoomsCollection: AngularFirestoreCollection<any>;
    loggedInUserData: any;
    selectedChatRoomData: any;
    user: any;
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private _userService: UserService
    ) {
        this.chatRoomsCollection = afs.collection<any>('chatRooms');
        this.afAuth.authState.subscribe(data => {
            if (data) {
                this.loggedInUserData = data;
                this._userService.getUser().subscribe(user => {
                    this.user = user;
                });
            }
        });
    }

    getUserChatRooms() {
        return this.afs.collection<any>('chatRooms', ref => ref.
            where('users', 'array-contains', this.loggedInUserData['uid']))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    addRoom(newChatRoom) {
        console.log('addRoom');
        return new Promise((resolve, reject) => {
            if (newChatRoom['type'] === 'private') {
                const checkChatRoomExistSubscription = this.checkChatRoomExist(newChatRoom).subscribe(isRoomExistData => {
                    if (isRoomExistData && isRoomExistData.length) {
                        console.log('isRoomExistData', isRoomExistData);
                        let found = false;
                        for (let i = 0; i < isRoomExistData.length; i++) {
                            if (isRoomExistData[i]['users'].indexOf(this.loggedInUserData['uid']) !== -1) {
                                found = true;
                                resolve([isRoomExistData[i]]);
                                break;
                            }
                        }
                        if (!found) {
                            this.chatRoomsCollection.add(newChatRoom).then(res => {
                                resolve(res);
                            });
                        }
                    } else {
                        this.chatRoomsCollection.add(newChatRoom).then(res => {
                            resolve(res);
                        });
                    }
                    checkChatRoomExistSubscription.unsubscribe();
                });
            } else {
                this.chatRoomsCollection.add(newChatRoom).then(res => {
                    resolve(res);
                });
            }
        });
    }

    deleteChatRoom(chatRoom) {
        return this.afs.collection<any>('chatRooms').doc(chatRoom.id).delete();
    }

    checkChatRoomExist(data) {
        return this.afs.collection<any>('chatRooms', ref => ref.where('type', '==', 'private')
            .where('users', 'array-contains', data['users'][1])).snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const roomData = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...roomData };
                }))
            );
    }

    sendMessage(messageData) {
        return this.afs.collection<any>(`chatRooms/${messageData['chatRoomId']}/messages`).add({
            message: messageData['message'],
            time: new Date().toString(),
            user: this.user
        });
    }

    getRoomMessages(roomId) {
        return this.afs.collection<any>(`chatRooms/${roomId}/messages`, ref => ref.orderBy('time'));
    }
}
