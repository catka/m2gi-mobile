import { PhotoService } from './../../services/photo.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-user-settings-image-popover',
  templateUrl: './user-settings-image-popover.component.html',
  styleUrls: ['./user-settings-image-popover.component.scss'],
})
export class UserSettingsImagePopoverComponent implements OnInit {
  uid: string;
  public photoUrl$: Observable<String>;
  loading: boolean = false;
  @ViewChild("file") fileInput: ElementRef;

  constructor(public popoverController: PopoverController, private photoService: PhotoService) { }


  ngOnInit() {
  }

  triggerUploadFile() {
    this.fileInput.nativeElement.click();
  }

  async uploadFile(files) {
    this.loading = true;
    if (files.length > 0) {
    let path = await this.photoService.uploadUserPicture(files[0], this.uid);
      this.photoUrl$ = of(path);
      this.loading = false;
      this.dismissPopover(this.photoUrl$);
    }
    this.loading = false;
  }

  async camera() {
    this.loading = true;
    let imageBase64 = await this.photoService.takePicture();
    if (!imageBase64) {
      this.loading = false;
      return;
    }
    let path = await this.photoService.uploadUserPictureB64(imageBase64, this.uid);
    this.photoUrl$ = of(path);
    this.loading = false;
    this.dismissPopover(this.photoUrl$);
  }
  async removePic() {
    this.loading = true;
    let path = await this.photoService.getDefaultUserPicture();
    this.photoUrl$ = of(path);
    this.loading = false;
    this.dismissPopover(this.photoUrl$);
  }

  dismissPopover(res?) {
    this.popoverController.dismiss(res);
  }
}
