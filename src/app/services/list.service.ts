import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];
  currentListId = 0;

  constructor() {
    let l = new List("Test list", this.nextId());
    l.todos.push(new Todo("Task1", "This is a first task"));
    this.lists.push(l);
  }

  getAll(): List[]{
    return this.lists;
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
    this.lists = this.lists.filter((l) => l != list);
  }

  nextId(): number{
    this.currentListId++;
    return this.currentListId;
  }
}
