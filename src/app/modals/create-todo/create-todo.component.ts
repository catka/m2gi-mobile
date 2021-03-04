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
  @Input() listId: string;
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
        this.todo = new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value);
        this.todoService.create(this.todo, this.listId).then((result) => {
          this.todo.id = result.id;
        });
      } else {
        console.log('this is an update');
        Object.assign(this.todo, this.todoForm.value);
        this.todoService.update(this.todo, this.listId);
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