import { CreateListComponent } from './../modals/create-list/create-list.component';
import { ListService } from './../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from '../models/list';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {test} from 'fuzzy';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  currentLists: Observable<List[]>;

  constructor(private listService: ListService, public modalController: ModalController, private router: Router) { }


  ngOnInit(): void {
    this.currentLists = this.listService.getAll();
    this.listService.getAll().subscribe((newList) => this.listTestToDelete(newList));
  }


  listTestToDelete(ttt){
    debugger;
  }

  get list(): List[]{
    return  this.listService.getAllOld();
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
