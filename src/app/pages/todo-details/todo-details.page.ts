import {Component, Input, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController, ModalController } from '@ionic/angular';
import { Todo } from 'src/app/models/todo';
import { ListService } from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {Validators} from '@angular/forms';
import {List} from '../../models/list';

@Component({
  selector: 'app-todo-details',
  templateUrl: './todo-details.page.html',
  styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {

  todo: Todo;

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toast: ToastController, private modalController: ModalController, private todoService: TodoService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params && params['id']) {
        this.todo = this.todoService.getOne(+params['id']);
      }
    });
  }

  onSubmit() {
  }

  back(): void{
    this.router.navigateByUrl('/home');
  }
}