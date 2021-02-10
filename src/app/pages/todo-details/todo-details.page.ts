import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, ModalController} from '@ionic/angular';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {List} from '../../models/list';
import {Location} from '@angular/common';

@Component({
    selector: 'app-todo-details',
    templateUrl: './todo-details.page.html',
    styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {
    public todoDetailsForm: FormGroup = new FormGroup({});

    todo: Todo;

    constructor(private _fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router, private modalController: ModalController, private todoService: TodoService, private _location: Location, public toastController: ToastController) {
        this.todoDetailsForm = this._fb.group({
            name: ['', Validators.required],
            isDone: [false],
            description: [''],
        });
    }

    ngOnInit() {
        const todoId = this.route.snapshot.paramMap.get('id');
        if (todoId) {
          this.todo = this.todoService.getOne(+todoId);
          if (this.todo){
            this.todoDetailsForm.patchValue(this.todo);
          }
        }
    }

    onSubmit() {
        if (this.todoDetailsForm.valid) {
            if(this.todo){
                this.todoService.update(this.todo, this.todoDetailsForm.value);
                this.showToast('Updated successfully.', false);

            } else{
                console.log('Cannot update empty todo object!');
            }
        } else{
            this.showToast('Todo name cannot be empty.', true);
        }
    }

    back(): void {
        this._location.back();
    }

    async showToast(alertMessage: string, error: boolean) {
        const toast = await this.toastController.create({
            message: alertMessage,
            duration: 2000,
            color: error ? 'danger' : 'primary',
        });
        await toast.present();
    }

}