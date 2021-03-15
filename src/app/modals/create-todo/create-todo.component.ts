import {Component, Input, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ModalController, ToastController} from '@ionic/angular';
import {List} from 'src/app/models/list';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {LocationService} from '../../services/location.service';

@Component({
  selector: 'app-create-todo',
  templateUrl: './create-todo.component.html',
  styleUrls: ['./create-todo.component.scss'],
})
export class CreateTodoComponent implements OnInit {
  public todoForm: FormGroup = new FormGroup({});
  @Input() listId: string;
  @Input() todo: Todo;

  constructor(private _fb: FormBuilder, private modalCtrl: ModalController, public toastController: ToastController, private todoService: TodoService, private locationService: LocationService) {
  }

  ngOnInit() {
    this.todoForm = this._fb.group({
      name: ['', Validators.required],
      description: [''],
      address: [''],
    });

    if (this.todo) {
      this.todoForm.patchValue(this.todo);
    }
  }

  // Location is set on the todo object dependent on the address field on the form
  async processLocationForForm(todo: Todo) {
    const addressInput = this.todoForm.get('address');
    const addressInputValue = addressInput.value;
    // No need to recall API and reset geopoint if address hasn't changed
    if (addressInput.touched) {
      if (addressInputValue === '') {
        // Reset geopoint to null when address emptied
        todo.setLocation(null);
      } else {
        let latAndLong;
        latAndLong = await this.locationService.geocode(addressInputValue);
        todo.setLocationWithLatAndLong(latAndLong[0], latAndLong[1]);
      }
    }
  }

  async onSubmit() {
    if (this.todoForm.valid) {
      const newTodo = new Todo();
      Object.assign(newTodo, this.todoForm.value);
      try {
        await this.processLocationForForm(newTodo);
      } catch (error) {
        console.log('Error geocoding location: ' + error.message + ', error code = ' + error.status);
        // If the api returned an empty list (this.locationService.ADDRESS_NOT_FOUND_ERROR) or the api status is 422. It is highly likely to be a User input error
        if (error.message === this.locationService.ADDRESS_NOT_FOUND_ERROR || error.status === 422) {
          this.showToast('Error finding address, please check your address input before saving or empty the field.', true);
        } else {
          this.showToast('Error finding address, please check your address input before saving or empty the field. If this problem persists, please contact the administrator', true);
        }
        // Cancel submit
        return;
      }

      // Create
      if (!this.todo){
        this.todo = new Todo();
        // Copy local todo to form todo
        Object.assign(this.todo, newTodo);
        this.todoService.create(this.todo, this.listId).then((result) => {
          this.todo.id = result.id;
        });
      } else { // Update
        Object.assign(this.todo, newTodo);
        this.todoService.update(this.todo, this.listId);
      }
      //
      // if (!this.todo) {
      //   // this.todo = new Todo(this.todoForm.get('name').value, this.todoForm.get('description').value);
      //   this.todo = new Todo();
      //   Object.assign(this.todo, this.todoForm.value);
      //   this.todoService.create(this.todo, this.listId).then((result) => {
      //     this.todo.id = result.id;
      //   });
      // } else {
      //   console.log('this is an update');
      //   Object.assign(this.todo, this.todoForm.value);
      //   this.todoService.update(this.todo, this.listId);
      // }
      this.modalCtrl.dismiss();
    } else {
      this.showToast('Todo name cannot be empty.', true);
    }
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