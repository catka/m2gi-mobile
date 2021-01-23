import { CreateTodoComponent } from './../../modals/create-todo/create-todo.component';
import { ToastController, ModalController } from '@ionic/angular';
import { ListService } from './../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/models/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models/todo';
import {TodoService} from '../../services/todo.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
  list: List;

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toast: ToastController, private modalController: ModalController, private todoService: TodoService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.list = this.listService.getOne(+params['id']);
      }
    })
    
  }

  back(): void{
    this.router.navigateByUrl('/home');
  }

  async newTodoModal(todo?: Todo){
    const modal = await this.modalController.create({
      component: CreateTodoComponent,
      cssClass: 'create-todo',
      componentProps: {
        list: this.list,
        todo: todo,
      }
    });

    return await modal.present();
  }

  updateTodo(todo: Todo) : void {
    this.newTodoModal(todo);
  }

  deleteTodo(todo: Todo) : void {
    this.todoService.delete(todo, this.list);
  }
}
