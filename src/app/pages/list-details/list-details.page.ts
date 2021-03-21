import { AuthService } from './../../services/auth.service';
import { ListService } from './../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { List } from 'src/app/models/list';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models/todo';
import { TodoService } from '../../services/todo.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {LocationService} from '../../services/location.service';

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

  constructor(private listService: ListService, private route: ActivatedRoute, private router: Router, private todoService: TodoService, private auth: AuthService, private translate: TranslateService, private locationService: LocationService) { }

  ngOnInit() {
    const listId = this.route.snapshot.paramMap.get('listId');
    this.list = this.listService.getOneObs(listId).pipe(
      switchMap((l: List) => this.todoService.getListTodos(l).pipe(
        map((todos) => l.todos = todos),
        map((_) => l.todos.sort((a: Todo, b: Todo) => a.createdAt - b.createdAt)),
        map((_) => l.todos.forEach( x => {x.distanceFromLocation$ = this.locationService.distanceFromCurrentPositionInKm(x.location); } ) ),
        map((_) => l),
      ))
    );

    let currentUid$ = this.auth.getConnectedUser().pipe(map((user) => user.uid));
    combineLatest([currentUid$, this.list]).subscribe(([uid, list]) => {
      if (list.owner) {
        this.owner = list.owner.id == uid;
      }
      this.canWrite = this.owner;
      if (!this.owner) {
        this.canWrite = list.canWrite && list.canWrite.find((ai) => ai.id === uid) != null;
      }

      this.listId = list.id;
    });
  }

  back(): void {
    this.router.navigateByUrl('/home');
  }

  updateTodo(todo: Todo): void {
    if (this.canWrite) {
      this.router.navigateByUrl('lists/' + this.listId + '/todos/' + todo.id);
    }
  }

  deleteTodo(todo: Todo): void {
    if (this.canWrite) {
      if (confirm(this.translate.instant('alerts.todo.delete_confirm'))) {
        this.todoService.delete(todo.id, this.listId);
      }
    }
  }

  addNewTodo(): void {
    this.router.navigateByUrl('/lists/' + this.listId + '/todos/new');
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
