export class Todo {
  id: string;
  name: string;
  description: string;
  isDone: boolean = false;
  createdAt: any = new Date().getTime();

  constructor(name?: string, description?: string) {
    this.name = name;
    if(description)
      this.description = description;
  }
}
