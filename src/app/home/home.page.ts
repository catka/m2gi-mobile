import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import {ModalController, ToastController} from '@ionic/angular';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {test} from 'fuzzy';
import {Location} from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  currentLists: Observable<List[]>;

  constructor(private listService: ListService, public modalController: ModalController, private router: Router, public toastController: ToastController) { }


  ngOnInit(): void {
    this.currentLists = this.listService.getAll();
    // this.listService.getAll().subscribe((newList) => this.debugList(newList));
  }

  // debugList(ttt){
  //   debugger;
  // }

  delete(list: List): void {
    this.listService.delete(list)
        .then(() => { // TODO : ADD TO TOAST
          this.showToast('List successfully deleted!', false);
      }).catch((error) => {
        console.error('Error removing list: ', error);
        this.showToast('There was an error removing the list', false);
    });
  }

  update(list: List): void {
    this.newListModal(list);
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

  goToList(l: List): void{
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


}
