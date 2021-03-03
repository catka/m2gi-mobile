import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {TodoService} from './todo.service';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];
  currentListId = 0;

  private listCollection: AngularFirestoreCollection<List>;

  constructor(private todoService: TodoService, private af : AngularFirestore) {
    let l = new List("Test list", this.nextId());
    // l.todos.push(new Todo("Task1", "This is a first task"));
    todoService.create(new Todo("Task 1", "This is a first task"), l);
    this.lists.push(l);

    this.listCollection = this.af.collection('lists');
  }

  getAll(): List[]{
    return this.lists;
  }

  getAllObs(): Observable<List> {
    return this.listCollection.snapshotChanges().pipe(
        map(actions => this.convertSnapshotData<List>(actions))
    );
  }

  getOne(id: number): List{
    return this.lists.find((l) => l.id === id);
  }

  create(list: List): void{
    list.id = this.nextId();
    this.lists.push(list);
  }

  update(list: List, value): void{
    list = Object.assign(list, value);
  }

  delete(list: List): void{
    this.lists = this.lists.filter((l) => l !== list);
  }

  nextId(): number{
    this.currentListId++;
    return this.currentListId;
  }

  private convertSnapshotData<T>(actions){
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data} as T;
    });
  }
}
