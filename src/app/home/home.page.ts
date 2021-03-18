import { AccountInfoService } from 'src/app/services/account-info.service';
import { AuthService } from 'src/app/services/auth.service';
import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  currentUid: string = '';
  currentLists: Observable<List[]>;

  constructor(private listService: ListService, public modalController: ModalController, private router: Router, public toastController: ToastController, private auth: AuthService, private accountInfoService: AccountInfoService) { }


  ngOnInit(): void {
    this.currentLists = this.listService.getAll();
    this.auth.getConnectedUser().subscribe((user) => { this.currentUid = user?.uid });
  }

  delete(list: List): void {
    if (this.currentUid != list.owner.id && list.canWrite && list.canWrite.find((ai) => ai.id === this.currentUid) != null)
      return;
    this.listService.delete(list)
      .then(() => { // TODO : ADD TO TOAST
        this.showToast('List successfully deleted!', false);
      }).catch((error) => {
        console.error('Error removing list: ', error);
        this.showToast('There was an error removing the list', false);
      });
  }

  update(list: List): void {
    if (this.currentUid != list.owner.id && !this.canWriteList(list))
      return;
    this.newListModal(list);
  }

  toastSharerName(name: string) {
    this.showToast("List shared by " + name, false);
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

  async showToast(alertMessage: string, error: boolean) {
    const toast = await this.toastController.create({
      message: alertMessage,
      duration: 2000,
      color: error ? 'danger' : 'primary',
    });
    await toast.present();
  }


  canWriteList(l: List): boolean {
    return l.canWrite && l.canWrite.find((ai) => ai.id === this.currentUid) != null;
  }
}
