export class Todo {
  id: number;
  name: string;
  description: string;
  isDone: boolean = false;

  constructor(name: string, description?: string) {
    this.name = name;
    if(description)
      this.description = description;
  }
}
