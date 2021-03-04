import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, ModalController} from '@ionic/angular';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-todo-details',
    templateUrl: './todo-details.page.html',
    styleUrls: ['./todo-details.page.scss'],
})
export class TodoDetailsPage implements OnInit {
    public todoDetailsForm: FormGroup = new FormGroup({});
    listId: string;
    todoId: string;
    todo: Observable<Todo>;

    constructor(private _fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router, private modalController: ModalController, private todoService: TodoService, private _location: Location, public toastController: ToastController) {
        this.todoDetailsForm = this._fb.group({
            name: ['', Validators.required],
            isDone: [false],
            description: [''],
        });
    }

    ngOnInit() {
        this.listId = this.route.snapshot.paramMap.get('listId');
        this.todoId = this.route.snapshot.paramMap.get('todoId');

        this.todo = this.todoService.getOneObs(this.todoId, this.listId);

        this.todo.subscribe((todo) => {
            this.todoDetailsForm.patchValue(todo);
        });
    }

    onSubmit() {
        if (this.todoDetailsForm.valid) {
            if (this.todoId) {
                let todo = new Todo();
                todo.id = this.todoId;
                Object.assign(todo, this.todoDetailsForm.value);
                this.todoService.update(todo, this.listId);

                this.showToast('Updated successfully.', false);
                this.backToList();
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

    backToList(): void{
        this.router.navigateByUrl('/lists/' + this.listId);
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