import { Todo } from './todo';

export class List {
  id: number;
  name: string;
  todos: Todo[] = [];

  constructor(name: string, id?: number) {
    this.name = name;
    if(id)
      this.id = id;
  }

  get stats(): string {
    return   this.todos.filter((t) => t.isDone).length + "/" + this.todos.length;
  }
}
