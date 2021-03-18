import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Plugins, CameraResultType, CameraPhoto, CameraSource } from '@capacitor/core';

const { Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  fileUploadTask: AngularFireUploadTask;

  constructor(private afStorage: AngularFireStorage) { }

  async takePicture(): Promise<CameraPhoto> {
    try {

      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        width: 100,
        height: 100,
        quality: 100
      });

      return capturedPhoto;
    } catch (e) {
      return null;
    }
  }


  async uploadUserPicture(file: File, name): Promise<string> {
    // Create a root reference
    var storageRef = this.afStorage.storage.ref();
    // Ref to name.jpg
    var imageRef = storageRef.child(`userpics/${name}.${file.name.split('.').pop()}`);
    var metadata = {
      contentType: file.type,
    };
    await imageRef.put(file, metadata).then((snapshot) => {
      console.log('Uploaded a file!');
    });

    return imageRef.getDownloadURL();
  }

  async uploadUserPictureB64(file, name): Promise<string> {
    // Create a root reference
    var storageRef = this.afStorage.storage.ref();
    // Ref to name.jpg
    var imageRef = storageRef.child(`userpics/${name}.${file.format}`);

    var metadata = {
      contentType: `image/${file.format}`,
    };
    await imageRef.putString(file.base64String, 'base64', metadata).then((snapshot) => {
      console.log('Uploaded a base64 string!');
    });

    return imageRef.getDownloadURL();
  }

  async getDefaultUserPicture(): Promise<string> {
    var storageRef = this.afStorage.storage.ref();
    var imageRef = storageRef.child('userpics/basic_picture.png');
    return imageRef.getDownloadURL();
  }
}
