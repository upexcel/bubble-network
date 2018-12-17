import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedInUserData: any;
  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.afAuth.authState.subscribe(data => {
      console.log('auth state change: ', data);
      if (data) {
        this.loggedInUserData = data;
      }
    });
  }

  getUser(): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.object(`user/${this.loggedInUserData['uid']}`).valueChanges();
  }

  getUserById(id): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.object(`user/${id}`).valueChanges();
  }

  getAllUser(): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.list(`user`).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ key: a.key, ...a.payload.val() }))
      )
    );
  }

  getUserFriends(): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.list(`friends`, ref => ref.orderByChild('userId').equalTo(this.loggedInUserData['uid'])).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ key: a.key, ...a.payload.val() }))
      )
    );
  }

  updateUser(
    firstName: string,
    lastName: string,
    username: string,
    gender: string,
    country: string,
    birthday: any,
    websiteLink: string
  ) {
    return this.db
      .list('user')
      .update(this.loggedInUserData['uid'], {
        firstName,
        lastName,
        username,
        gender,
        country,
        birthday,
        websiteLink
      });
  }

  updateUserImage(profileImage) {
    return this.db
      .list('user')
      .update(this.loggedInUserData['uid'], {
        profileImage
      });
  }

  updateUserBannerImage(bannerImage) {
    return this.db
      .list('user')
      .update(this.loggedInUserData['uid'], {
        bannerImage
      });
  }

  addFriend(data) {
    return this.db
      .list('friends')
      .push(data);
  }

  removeFriend(data) {
    return this.db
      .list('friends')
      .remove(data['key']);
  }

  followUser(data) {
    return this.db
      .list('follow')
      .push(data);
  }

  unFollowUser(data) {
    return this.db
      .list('follow')
      .remove(data['followKey']);
  }

  getUserFollowing(): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.list(`follow`, ref => ref.orderByChild('userId').equalTo(this.loggedInUserData['uid'])).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ followKey: a.key, ...a.payload.val() }))
      )
    );
  }

  getUserFollowers(): Observable<any> {
    if (!this.loggedInUserData) {
      return;
    }
    return this.db.list(`follow`, ref => ref.orderByChild('followUserId').equalTo(this.loggedInUserData['uid'])).snapshotChanges().pipe(
      map(actions =>
        actions.map(a => ({ followKey: a.key, ...a.payload.val() }))
      )
    );
  }

  getUserFriendsWithData(friends) {
    return new Promise((resolve, reject) => {
      let count = 0;
      const callback = () => {
        if (count === friends.length) {
          resolve(friends);
        } else {
          this.getUserById(friends[count]['friendId']).subscribe(user => {
            friends[count] = { ...friends[count], ...user };
            ++count;
            callback();
          });
        }
      };
      callback();
    });
  }

  getUserFollowersWithData(followers) {
    return new Promise((resolve, reject) => {
      let count = 0;
      const callback = () => {
        if (count === followers.length) {
          resolve(followers);
        } else {
          this.getUserById(followers[count]['userId']).subscribe(user => {
            followers[count] = { ...followers[count], ...user };
            ++count;
            callback();
          });
        }
      };
      callback();
    });
  }

  getUserFollowingWithData(following) {
    return new Promise((resolve, reject) => {
      let count = 0;
      const callback = () => {
        if (count === following.length) {
          resolve(following);
        } else {
          this.getUserById(following[count]['followUserId']).subscribe(user => {
            following[count] = { ...following[count], ...user };
            ++count;
            callback();
          });
        }
      };
      callback();
    });
  }
}
