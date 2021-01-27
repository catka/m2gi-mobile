import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: 'home',
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'lists',
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('./pages/list-details/list-details.module').then( m => m.ListDetailsPageModule)
  },
  {
    path: 'todos',
    canActivate: [AngularFireAuthGuard],
    loadChildren: () => import('./pages/todo-details/todo-details.module').then( m => m.TodoDetailsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
