import {AuthService} from 'src/app/services/auth.service';
import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastController, ModalController} from '@ionic/angular';
import {Todo} from 'src/app/models/todo';
import {ListService} from 'src/app/services/list.service';
import {TodoService} from '../../services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {combineLatest, forkJoin, from, Observable, of, pipe, zip} from 'rxjs';
import { flatMap, map, mergeMap, startWith, tap } from 'rxjs/operators';
import {List} from 'src/app/models/list';
import {LocationService} from '../../services/location.service';
import {Geolocation, GeolocationPosition} from '@capacitor/core';
import {TranslateService} from '@ngx-translate/core';

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
  list$: Observable<List>;
  distanceFromPosition$: Observable<number>;
  owner = false;
  canWrite$: Observable<boolean>;
  mapUrl = 'https://maps.google.com/maps?daddr=';
  locationSpecificMapUrl = null;

  constructor(private _fb: FormBuilder, private listService: ListService, private route: ActivatedRoute, private router: Router,
              private todoService: TodoService, private _location: Location,
              public toastController: ToastController, private auth: AuthService, private locationService: LocationService, private translate: TranslateService) {
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

    if (this.todoId == 'new') {
      this.todoId = null;
      this.todo = of(new Todo());
    } else {
      this.todo = this.todoService.getOneObs(this.todoId, this.listId);
    }

    this.list$ = this.listService.getOneObs(this.listId);

    const currentUid$ = this.auth.getConnectedUser().pipe(map((user) => user.uid));

    this.canWrite$ = combineLatest([this.list$, currentUid$]).pipe(
      map(([list, uid]) => {
        this.owner = list.owner.id == uid;
        return list.canWrite.find((ai) => ai.id == uid) != null || this.owner;
      }),
      startWith(false),
      tap((canWrite) => {
        if (canWrite) {
          this.todoDetailsForm.enable();
        } else {
          this.todoDetailsForm.disable();
        }
      })
    );

    this.todo.subscribe(
      (todo) => {
        if (todo) {
          this.todoDetailsForm.patchValue(todo);
          this.locationSpecificMapUrl = todo.address ? encodeURI(`${this.mapUrl}${todo.address}`) : null;
        }

        // When todo loads, the distance is defined by the difference with the todo geopoint and the geolocation promise
        if (todo && todo.location !== null){
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
          const todo = new Todo();
          try {
            await this.processLocationForForm(todo);
          } catch (error) {
            console.log('Error geocoding location: ' + error.message + ', error code = ' + error.status);
            // If the api returned an empty list (this.locationService.ADDRESS_NOT_FOUND_ERROR) or the api status is 422. It is highly likely to be a User input error
            if (error.message === this.locationService.ADDRESS_NOT_FOUND_ERROR || error.status === 422) {
              this.showToastWithKey('alerts.todo.error_address', true);
            } else {
              this.showToastWithKey('alerts.todo.error_address_admin', true);
            }
            // Cancel submit
            return;
        }
        
        Object.assign(todo, this.todoDetailsForm.value);

        if (!this.todoId) {
          await this.todoService.create(todo, this.listId);
          this.showToastWithKey('alerts.todo.success', false);
          this.backToList();
        } else {
          todo.id = this.todoId;
          await this.todoService.update(todo, this.listId);
          this.showToast('Updated successfully.', false);
          this.backToList();
        }
      } else {
        this.showToastWithKey('alerts.todo.empty_name', true);
      }
    } else {
      this.showToastWithKey('alerts.todo.permissions_error', true);
    }
  }

  back(): void {
    this._location.back();
  }

  backToList(): void {
    this.router.navigateByUrl('/lists/' + this.listId);
  }

  async showToastWithKey(translationKey: string, error: boolean, parameters = {}) {
    await this.showToast(this.translate.instant(translationKey, parameters), error);
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
