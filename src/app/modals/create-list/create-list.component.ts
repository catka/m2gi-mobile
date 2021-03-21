import { ListService } from './../../services/list.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';
import { ModalController, ToastController } from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {AccountInfoService} from '../../services/account-info.service';
import {Observable} from 'rxjs';
import {AccountInfo} from '../../models/accountInfo';
import firebase from 'firebase';
import User = firebase.User;
import { AccountInfoAutocompleteService } from 'src/app/services/account-info-autocomplete.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  public listForm: FormGroup = new FormGroup({});
  accountInfos: Observable<AccountInfo[]>;
  @Input() list: List;
  public user: User;
  public account: AccountInfo;
  canReadUsers: AccountInfo[] = [];
  canWriteUsers: AccountInfo[] = [];

  constructor(private _fb: FormBuilder, private listService: ListService, private modalCtrl: ModalController,
    public toastController: ToastController, private authService: AuthService, private accountInfoService: AccountInfoService, private translate: TranslateService, public autocompleteService: AccountInfoAutocompleteService) { }

  ngOnInit() {

    this.authService.getConnectedUser().subscribe((user) => {
      this.user = user;
      this.accountInfoService.getOneObs(this.user.uid).subscribe((ac) => {
        this.account = ac;
      });
    });

    this.listForm = this._fb.group({
      name: ['', Validators.required],
      owner: [''],
    });

    if (this.list) {
      this.listForm.patchValue(this.list);
      this.canReadUsers = this.list.canRead;
      this.canWriteUsers = this.list.canWrite;
    }
    this.accountInfos = this.accountInfoService.getAll();
  }

  onSubmit() {
    if (this.listForm.valid) {
      if (!this.list) {
        const listToCreate = new List(this.listForm.get('name').value, this.account, this.canReadUsers, this.canWriteUsers);
        this.listService.create(listToCreate)
            .then(() => {
              this.showToastWithKey('alerts.list.created', false);
            })
            .catch((error) => {
              console.error('Error updating list: ', error);
              this.showToastWithKey('alerts.list.created_error', false);
            });
      } else {
        const listToUpdate = new List(this.listForm.get('name').value, this.list.owner, this.canReadUsers, this.canWriteUsers);
        this.listService.update(this.list, listToUpdate)
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

  public cancel() {
    this.modalCtrl.dismiss();
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
}
