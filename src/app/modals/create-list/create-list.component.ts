import { ListService } from './../../services/list.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  public listForm: FormGroup = new FormGroup({});
  @Input() list: List;

  constructor(private _fb: FormBuilder, private listService: ListService, private modalCtrl: ModalController, public toastController: ToastController) {
  }

  ngOnInit() {
    this.listForm = this._fb.group({
      name: ['', Validators.required],
    });

    if (this.list) {
      this.listForm.patchValue(this.list);
    }
  }

  onSubmit() {
    if (this.listForm.valid) {
      if (!this.list) {
        this.listService.create(new List(this.listForm.get('name').value));
      } else {
        this.listService.update(this.list, this.listForm.value);
      }
      this.modalCtrl.dismiss();
    } else {
      this.showErrorToast("List name cannot be empty.");
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
