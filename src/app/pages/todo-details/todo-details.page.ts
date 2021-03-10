import { AuthService } from 'src/app/services/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, ModalController} from '@ionic/angular';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { List } from 'src/app/models/list';

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
    list: Observable<List>;
    owner: boolean = false;
    canWrite: boolean = false;

    constructor(private _fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router, private modalController: ModalController, private todoService: TodoService, private _location: Location, public toastController: ToastController, private auth: AuthService) {
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
        this.list = this.listService.getOneObs(this.listId);

        let currentUid$ = this.auth.getConnectedUser().pipe(map((user) => user.uid));
        combineLatest([currentUid$, this.list]).subscribe(([uid, list]) => {
            this.owner = list.owner == uid;
            this.canWrite = this.owner;
            if (!this.owner) {
                this.canWrite = list.canWrite.includes(uid);
            }
        });

        this.todo.subscribe((todo) => {
            this.todoDetailsForm.patchValue(todo);
        });
    }

    onSubmit() {
        if (this.canWrite) {
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
        } else {
            this.showToast('You do not have permission to update this item.', true);
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