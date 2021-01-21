import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{  
  constructor(private listService: ListService, public modalController: ModalController, private router: Router) { }
  
  ngOnInit(): void {
  }

  get list(): List[]{
    return  this.listService.getAll();
  }

  delete(list: List): void {
    this.listService.delete(list);
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
}
