import { Todo } from './todo';

export class List {
  id: number;
  name: string;
  todos: Todo[] = [];

  constructor(name: string) {
    this.name = name;
  }
}
