import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../user/services/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class BubblePostService {
    private bubblePostCollection: AngularFirestoreCollection<any>;
    loggedInUserData: any;
    user: any;
    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private _userService: UserService,
        private storage: AngularFireStorage
    ) {
        this.bubblePostCollection = afs.collection<any>('bubblePost');
        this.afAuth.authState.subscribe(data => {
            if (data) {
                this.loggedInUserData = data;
                this._userService.getUser().subscribe(user => {
                    this.user = user;
                });
            }
        });
    }

    async addNewPost(newPost) {
        return this.bubblePostCollection.add(newPost);
    }

    addLike(id) {
        return this.afs.collection<any>(`bubblePost/${id}/likes`).add({
            time: new Date().toString(),
            user: this.loggedInUserData['uid']
        });
    }

    removeLike(bubblePostId, likeId) {
        return this.afs.collection<any>(`bubblePost/${bubblePostId}/likes`).doc(likeId).delete();
    }

    updateLike(bubblePostId, likesCount) {
        return this.afs.collection<any>(`bubblePost`).doc(bubblePostId).update({
            likes: likesCount
        });
    }

    updateBubble(bubblePostId, newData) {
        return this.afs.collection<any>(`bubblePost`).doc(bubblePostId).update(newData);
    }

    deleteBubblePost(bubblePost) {
        // Create a reference to the file to delete
        const fileRef = this.storage.storage.refFromURL(bubblePost['url']);
        // Delete the file
        fileRef.delete().then((res) => {
            // File deleted successfully
            return this.afs.collection<any>(`bubblePost`).doc(bubblePost['id']).delete();
        }, e => {
            console.log(e);
        });
    }

    getUserBubblePosts(userId?) {
        return this.afs.collection<any>('bubblePost', ref => ref.
            where('authorId', '==', userId ? userId : this.loggedInUserData['uid']).orderBy('likes'))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    getAllBubblePosts() {
        return this.afs.collection<any>('bubblePost', ref => ref.orderBy('likes'))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    getBubblePostLikes(postId) {
        return this.afs.collection<any>(`bubblePost/${postId}/likes`)
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    getBubblePostComments(postId) {
        return this.afs.collection<any>(`bubblePost/${postId}/comments`, ref => ref.orderBy('time'))
            .snapshotChanges().pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
            );
    }

    addComment(postId, commentData) {
        return this.afs.collection<any>(`bubblePost/${postId}/comments`).add(commentData);
    }
}
