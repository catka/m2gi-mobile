import { ListService } from './../../services/list.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';
import { ModalController, ToastController } from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {AccountInfoService} from '../../services/account-info.service';
import {Observable} from 'rxjs';
import {AccountInfo} from '../../models/accountInfo';
import firebase from 'firebase';
import User = firebase.User;

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  public listForm: FormGroup = new FormGroup({});
  // public availableUserIds: string[] = [];
  accountInfos: Observable<AccountInfo[]>;
  @Input() list: List;
  public user: User;

  constructor(private _fb: FormBuilder, private listService: ListService, private modalCtrl: ModalController,
              public toastController: ToastController, private authService: AuthService, private accountInfoService: AccountInfoService) {
  }

  ngOnInit() {

    this.authService.getConnectedUser().subscribe(user => this.user = user);

    this.listForm = this._fb.group({
      name: ['', Validators.required],
      canRead: [''],
      canWrite: [''],
      owner: [''],
    });

    if (this.list) {
      this.listForm.patchValue(this.list);
    }
    // this.availableUserIds = this.authService.getAllUserIds();
    this.accountInfos = this.accountInfoService.getAll();
  }

  onSubmit() {
    if (this.listForm.valid) {
      if (!this.list) {
        // getConnectedUser
        // const listToCreate = new List(this.listForm.get('name').value, this.authService.getLoggedInUser(), this.listForm.get('canRead').value, this.listForm.get('canWrite').value);
        const listToCreate = new List(this.listForm.get('name').value, this.user.uid, this.listForm.get('canRead').value, this.listForm.get('canWrite').value);
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
        debugger;
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
