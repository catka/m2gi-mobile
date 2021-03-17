import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoDetailsPageRoutingModule } from './todo-details-routing.module';

import { TodoDetailsPage } from './todo-details.page';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TodoDetailsPageRoutingModule,
    TranslateModule
  ],
  declarations: [TodoDetailsPage]
})
export class TodoDetailsPageModule {}
