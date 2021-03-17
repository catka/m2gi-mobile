import { AccountInfoService } from 'src/app/services/account-info.service';
import { AuthService } from 'src/app/services/auth.service';
import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentUid: string = '';
  currentLists: Observable<List[]>;

  constructor(private listService: ListService, public modalController: ModalController, private router: Router, public toastController: ToastController, private auth: AuthService, private accountInfoService: AccountInfoService, private translate: TranslateService) { }


  ngOnInit(): void {
    this.currentLists = this.listService.getAll().pipe(
      map((lists) => {
        lists.forEach(async (l) => {
          l.ownerObj = l.owner ? this.accountInfoService.getOneObs(l.owner) : null;
        });
        return lists;
      })
    );
    this.auth.getConnectedUser().subscribe((user) => { this.currentUid = user?.uid });
  }

  delete(list: List): void {
    if (this.currentUid != list.owner && list.canWrite.indexOf(this.currentUid) < 0)
      return;
    this.listService.delete(list)
      .then(() => { // TODO : ADD TO TOAST
        this.showToastWithKey('alerts.home.deleted', false);
      }).catch((error) => {
        console.error('Error removing list: ', error);
        this.showToastWithKey('alerts.home.deleted_error', true);
      });
  }

  update(list: List): void {
    if (this.currentUid != list.owner && list.canWrite.indexOf(this.currentUid) < 0)
      return;
    this.newListModal(list);
  }

  toastSharerName(name: string) {
    this.showToastWithKey('alerts.home.shared_by', false, {name});
  }

  async newListModal(list?: List) {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      cssClass: 'create-list',
      componentProps: {
        list: list,
      }
    });

    return await modal.present();
  }

  goToList(l: List): void {
    this.router.navigateByUrl('/lists/' + l.id);
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
