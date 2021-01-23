import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { List } from 'src/app/models/list';
import { Todo } from 'src/app/models/todo';
import { ListService } from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  public todoForm: FormGroup = new FormGroup({});
  @Input() list: List;
  @Input() todo: Todo;

  constructor(private _fb: FormBuilder, private modalCtrl: ModalController, public toastController: ToastController, private todoService: TodoService) {
  }

  ngOnInit() {
    this.todoForm = this._fb.group({
      name: ['', Validators.required],
      description: [''],
    });

    if (this.todo) {
      this.todoForm.patchValue(this.todo);
    }
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (!this.todo) {
        // this.list.todos.push(new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value));
        this.todoService.create(new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value), this.list);
      } else {
        console.log('this is an update');
        const index = this.list.todos.findIndex((t) => t === this.todo);
        this.list.todos[index] = Object.assign(this.todo, this.todoForm);
      }
      this.modalCtrl.dismiss();
    } else {
      this.showErrorToast("Todo name cannot be empty.");
    }
  }

  async showErrorToast(err: string) {
    const toast = await this.toastController.create({
      message: err,
      duration: 2000
    });
    toast.present();
  }
}