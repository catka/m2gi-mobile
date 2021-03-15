import {AuthService} from 'src/app/services/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, ModalController} from '@ionic/angular';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {combineLatest, from, Observable, pipe} from 'rxjs';
import {map} from 'rxjs/operators';
import {List} from 'src/app/models/list';
import {LocationService} from '../../services/location.service';
import {Geolocation, GeolocationPosition} from '@capacitor/core';

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
  distanceFromPosition$: Observable<number>;
  owner = false;
  canWrite = false;
  mapUrl = 'https://maps.google.com/maps?daddr=';
  locationSpecificMapUrl = null;

  constructor(private _fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router,
              private modalController: ModalController, private todoService: TodoService, private _location: Location,
              public toastController: ToastController, private auth: AuthService, private locationService: LocationService) {
    this.todoDetailsForm = this._fb.group({
      name: ['', Validators.required],
      isDone: [false],
      description: [''],
      address: [''],
    });
  }

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('listId');
    this.todoId = this.route.snapshot.paramMap.get('todoId');

    this.todo = this.todoService.getOneObs(this.todoId, this.listId);
    this.list = this.listService.getOneObs(this.listId);

    const currentUid$ = this.auth.getConnectedUser().pipe(map((user) => user.uid));
    combineLatest([currentUid$, this.list]).subscribe(([uid, list]) => {
      this.owner = list.owner == uid;
      this.canWrite = this.owner;
      if (!this.owner) {
        this.canWrite = list.canWrite.includes(uid);
      }
    });

    this.todo.subscribe(
      (todo) => {
        this.todoDetailsForm.patchValue(todo);
        this.locationSpecificMapUrl = todo.address ? encodeURI(`${this.mapUrl}${todo.address}`) : null;

        // When todo loads, the distance is defined by the difference with the todo geopoint and the geolocation promise
        if (todo.location !== null){
          this.distanceFromPosition$ = this.locationService.distanceFromCurrentPositionInKm(todo.location);
        } else{
          this.distanceFromPosition$ = null;
        }
      }
    );
  }

  openMapUrl(){
    if (this.locationSpecificMapUrl){
      window.open(this.locationSpecificMapUrl, '_blank');
    } else{
      console.log('location cannot be opened in maps');
    }
  }

  // Location is set on the todo object dependent on the address field on the form
  async processLocationForForm(todo: Todo) {
    const addressInput = this.todoDetailsForm.get('address');
    const addressInputValue = addressInput.value;
    // No need to recall API and reset geopoint if address hasn't changed
    if (addressInput.touched) {
      if (addressInputValue === '') {
        // Reset geopoint to null when address emptied
        todo.location = null;
      } else {
        let latAndLong;
        latAndLong = await this.locationService.geocode(addressInputValue);
        todo.setLocationWithLatAndLong(latAndLong[0], latAndLong[1]);
      }
    }
  }

  async onSubmit() {
    if (this.canWrite) {
      if (this.todoDetailsForm.valid) {
        if (this.todoId) {
          const todo = new Todo();
          try {
            await this.processLocationForForm(todo);
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
          todo.id = this.todoId;
          Object.assign(todo, this.todoDetailsForm.value);
          await this.todoService.update(todo, this.listId);

          this.showToast('Updated successfully.', false);
          this.backToList();
        } else {
          console.log('Cannot update empty todo object!');
        }
      } else {
        this.showToast('Todo name cannot be empty.', true);
      }
    } else {
      this.showToast('You do not have permission to update this item.', true);
    }
  }

  back(): void {
    this._location.back();
  }

  backToList(): void {
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