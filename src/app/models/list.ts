import { Todo } from './todo';

export class List {
  id: string;
  name: string;
  todos: Todo[] = [];

  constructor(name: string, id?: string) {
    this.name = name;
    if(id)
      this.id = id;
  }

  get stats(): string {
    return   this.todos.filter((t) => t.isDone).length + "/" + this.todos.length;
  }
}
