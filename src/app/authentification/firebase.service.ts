import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  uploadImage(file: string, fileName) {
    return new Promise((resolve, reject) => {
      const filePath = `${fileName}.jpg`;

      const image = 'data:image/jpg;base64,' + file;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.ref(filePath).putString(image, 'data_url');

      // observe percentage changes
       task.percentageChanges().subscribe(progress => {
         console.log('progress', progress);
      });

      // get notified when the download URL is available
      task.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            console.log('downloadURL', url)
            resolve(url);
          });
        })
      )
        .subscribe();
    });
  }

}
