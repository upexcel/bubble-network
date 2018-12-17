/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

function sendNotification(tokens, title, body, icon) {
  // Notification details.
  const payload = {
    notification: {
      title: title,
      body: body,
      icon: icon
    }
  };

  // Send notifications to all tokens.
  return admin.messaging().sendToDevice(tokens, payload);
}


/**
 * Triggers when a user gets a new follower and sends a notification.
 */
exports.sendFollowerNotification = functions.database.ref('/follow/{followId}')
  .onCreate((snapshot, context) => {
    console.log('snapshot', snapshot)
    // Grab the current value of what was written to the Realtime Database.
    const latestCreatedData = snapshot.val();

    const devicesRef = admin.firestore().collection(`devices`).doc(latestCreatedData['followUserId']).get();
    const userRef = admin.database().ref(`/user/${latestCreatedData['userId']}`).once('value');

    return Promise.all([devicesRef, userRef]).then(results => {
      const deviceData = results[0].data();
      const userData = results[1].val();
      if (deviceData) {
        sendNotification([deviceData['token']], 'New Follower Added', `${userData['firstName']} ${userData['lastName']} start following you.`, userData['profileImage'] ? userData['profileImage'] : 'https://firebasestorage.googleapis.com/v0/b/bubbleflix-edc8d.appspot.com/o/logo.svg?alt=media&token=1067f76d-6722-42cf-b182-4db0970da7b8');
      }
      return Promise.all([]);
    });
  });


/**
 * Triggers when a user gets a new friend and sends a notification.
 */
exports.sendNewFriendNotification = functions.database.ref('/friends/{friendsId}')
  .onCreate((snapshot, context) => {
    console.log('snapshot', snapshot)
    // Grab the current value of what was written to the Realtime Database.
    const latestCreatedData = snapshot.val();

    const devicesRef = admin.firestore().collection(`devices`).doc(latestCreatedData['friendId']).get();
    const userRef = admin.database().ref(`/user/${latestCreatedData['userId']}`).once('value');

    return Promise.all([devicesRef, userRef]).then(results => {
      const deviceData = results[0].data();
      const userData = results[1].val();
      if (deviceData) {
        sendNotification([deviceData['token']], 'New Friend', `${userData['firstName']} ${userData['lastName']} added you as friend.`, userData['profileImage'] ? userData['profileImage'] : 'https://firebasestorage.googleapis.com/v0/b/bubbleflix-edc8d.appspot.com/o/logo.svg?alt=media&token=1067f76d-6722-42cf-b182-4db0970da7b8');
      }
      return Promise.all([]);
    });
  });
