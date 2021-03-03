import { ListService } from './../../services/list.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';
import { ModalController, ToastController } from '@ionic/angular';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  public listForm: FormGroup = new FormGroup({});
  public availableUserIds: string[] = [];
  @Input() list: List;

  constructor(private _fb: FormBuilder, private listService: ListService, private modalCtrl: ModalController, public toastController: ToastController, private authService: AuthService) {
  }

  ngOnInit() {
    this.listForm = this._fb.group({
      name: ['', Validators.required],
      canRead: ['', Validators.required],
      canWrite: ['', Validators.required],
    });
    if (this.list) {
      this.listForm.patchValue(this.list);
    }
    this.availableUserIds = this.authService.getAllUserIds();
  }

  onSubmit() {
    if (this.listForm.valid) {
      if (!this.list) {
        const listToCreate = new List(this.listForm.get('name').value, this.authService.getLoggedInUser(), this.listForm.get('canRead').value, this.listForm.get('canWrite').value);
        this.listService.create(listToCreate)
            .then(() => {
              // this.showErrorToast('Created!!');
              this.showToast('List successfully created!', false);
            })
            .catch((error) => {
              console.error('Error updating list: ', error);
              this.showToast('There was an error creating the list', false);
            });
      } else {
        this.listService.update(this.list, this.listForm.value)
            .then(() => {
              this.showToast('List successfully updated!', false);
            })
          .catch((error) => {
            console.error('Error updating list: ', error);
            this.showToast('There was an error removing the updating the list', false);
          });
      }
      this.modalCtrl.dismiss();
    } else {
      this.showToast('List name cannot be empty.', true);
    }
  }


  async showToast(alertMessage: string, error: boolean) {
    const toast = await this.toastController.create({
      message: alertMessage,
      duration: 2000,
      color: error ? 'danger' : 'primary',
    });
    await toast.present();
  }


  // async showErrorToast(err: string) {
  //   const toast = await this.toastController.create({
  //     message: err,
  //     duration: 2000
  //   });
  //   toast.present();
  // }
}
