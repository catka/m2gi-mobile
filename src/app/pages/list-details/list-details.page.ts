import { AuthService } from './../../services/auth.service';
import { CreateTodoComponent } from './../../modals/create-todo/create-todo.component';
import { ToastController, ModalController } from '@ionic/angular';
import { ListService } from './../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/models/list';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Todo } from 'src/app/models/todo';
import { TodoService } from '../../services/todo.service';
import { merge, Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.page.html',
  styleUrls: ['./list-details.page.scss'],
})
export class ListDetailsPage implements OnInit {
  list: Observable<List>;
  listId: string;
  owner: boolean = false;
  canWrite: boolean = false;

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private toast: ToastController, private modalController: ModalController, private todoService: TodoService, private auth: AuthService, private translate: TranslateService) { }

  ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('listId');
    this.list = this.listService.getOneObs(listId).pipe(
      switchMap((l: List) => this.todoService.getListTodos(l).pipe(
        map((todos) => l.todos = todos),
        map((_) => l.todos.sort((a: Todo, b: Todo) => a.createdAt - b.createdAt)),
        map((_) => l),
      ))
    );

    let currentUid$ = this.auth.getConnectedUser().pipe(map((user) => user.uid));
    combineLatest([currentUid$, this.list]).subscribe(([uid, list]) => {
      this.owner = list.owner == uid;
      this.canWrite = this.owner;
      if (!this.owner) {
        this.canWrite = list.canWrite.includes(uid);
      }

      this.listId = list.id;
    });
  }

  back(): void {
    this.router.navigateByUrl('/home');
  }

  async newTodoModal(todo?: Todo) {
    if (this.canWrite) {
      const modal = await this.modalController.create({
        component: CreateTodoComponent,
        cssClass: 'create-todo',
        componentProps: {
          listId: this.listId,
          todo: todo,
        }
      });

      return await modal.present();
    }
  }

  updateTodo(todo: Todo): void {
    if (this.canWrite) {
      this.newTodoModal(todo);
    }
  }

  deleteTodo(todo: Todo): void {
    if (this.canWrite) {
      if (confirm(this.translate.instant('alerts.todo.delete_confirm'))) {
        this.todoService.delete(todo.id, this.listId);
      }
    }
  }

  goToTodo(todo: Todo): void {
    this.router.navigateByUrl('/lists/' + this.listId + '/todos/' + todo.id);
  }

  toggleTodoDone(todo: Todo) {
    if (this.canWrite) {
      todo.isDone = !todo.isDone;
      this.todoService.update(todo, this.listId);
    }
  }
}
