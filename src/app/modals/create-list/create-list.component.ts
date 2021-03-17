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
import {TranslateService} from '@ngx-translate/core';

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
              public toastController: ToastController, private authService: AuthService, private accountInfoService: AccountInfoService, private translate: TranslateService) {
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
              this.showToastWithKey('alerts.list.created', false);
            })
            .catch((error) => {
              console.error('Error updating list: ', error);
              this.showToastWithKey('alerts.list.created_error', false);
            });
      } else {
        this.listService.update(this.list, this.listForm.value)
            .then(() => {
              this.showToastWithKey('alerts.list.updated', false);
            })
          .catch((error) => {
            console.error('Error updating list: ', error);
            this.showToastWithKey('alerts.list.updated_error', false);
          });
      }
      this.modalCtrl.dismiss();
    } else {
      this.showToastWithKey('alerts.list.empty_list', true);
    }
  }


  async showToastWithKey(translationKey: string, error: boolean, parameters = {}) {
    await this.showToast(this.translate.instant(translationKey, parameters), error);
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
