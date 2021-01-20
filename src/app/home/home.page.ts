import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{  
  constructor(private listService: ListService, public modalController: ModalController) { }
  
  ngOnInit(): void {
  }

  get list(): List[]{
    return  this.listService.getAll();
  }

  async newListModal() {
    const modal = await this.modalController.create({
      component: CreateListComponent,
      cssClass: 'create-list'
    });

    modal.onDidDismiss().then(() => {
      console.log("modal dissmissed.");
    });

    return await modal.present();
  }
}
