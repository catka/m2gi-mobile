import { NgModule } from '@angular/core';
import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { Routes, RouterModule } from '@angular/router';

import { ListDetailsPage } from './list-details.page';

const routes: Routes = [
  {
    path: ':listId',
    children: [
      {
        path: 'todos',
        loadChildren: () => import('./../todo-details/todo-details.module').then(m => m.TodoDetailsPageModule)
      },
      { path: '', component: ListDetailsPage, pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListDetailsPageRoutingModule {}
