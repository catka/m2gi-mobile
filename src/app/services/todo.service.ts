import {Injectable} from '@angular/core';
import {List} from '../models/list';
import {Todo} from '../models/todo';

@Injectable({
    providedIn: 'root'
})
export class TodoService {

    constructor() {
    }

    currentListId = 0;

    create(todo: Todo, list: List): void {
        todo.id = this.nextId();
        list.todos.push(todo);
    }

    delete(todoForDelete: Todo, list: List): void {
        list.todos = list.todos.filter((todo) => todo !== todoForDelete);
    }

    nextId(): number {
        this.currentListId++;
        return this.currentListId;
    }

}
