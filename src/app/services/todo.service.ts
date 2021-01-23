import {Injectable} from '@angular/core';
import {List} from '../models/list';
import {Todo} from '../models/todo';

@Injectable({
    providedIn: 'root'
})
export class TodoService {

    private todos: Todo[] = [];
    currentListId = 0;

    constructor() {
    }


    create(todo: Todo, list: List): void {
        todo.id = this.nextId();
        this.todos.push(todo);
        list.todos.push(todo);
    }

    delete(todoForDelete: Todo, list: List): void {
        // Remove from list and then from service list
        list.todos = list.todos.filter((todo) => todo !== todoForDelete);
        this.todos = this.todos.filter((todo) => todo !== todoForDelete);
    }

    nextId(): number {
        this.currentListId++;
        return this.currentListId;
    }

    getOne(id: number): Todo{
        return this.todos.find((todo) => todo.id === id);
    }

}
