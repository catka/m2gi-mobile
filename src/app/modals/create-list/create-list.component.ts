import { ListService } from './../../services/list.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/list';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  listForm: FormGroup;

  constructor(private _fb: FormBuilder, private listService: ListService) { }

  ngOnInit() {
    this.listForm = this._fb.group({
      name: this._fb.control('', Validators.required),
    });
  }

  submitForm() {
    console.log(this.listForm);
    if (this.listForm.valid) {
      this.listService.create(new List(this.listForm.get('name').value));
    } else {
      //TODO: Toast error msg
    }
  }
}
