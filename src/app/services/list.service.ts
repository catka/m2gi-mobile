import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];

  constructor() { }

  getAll(): List[]{
    return this.lists;
  }

  getOne(id: number): List{
    return this.lists.find((l) => l.id == id);
  }

  create(list: List): void{
    this.lists.push(list);
  }
}
