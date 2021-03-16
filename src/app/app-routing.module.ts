import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// import { canActivate, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { AuthGuard } from './guard/auth-guard.guard';

// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/list-details/list-details.module').then(m => m.ListDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'lists',
    loadChildren: () => import('./pages/list-details/list-details.module').then(m => m.ListDetailsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./pages/user-settings/user-settings.module').then(m => m.UserSettingsPageModule)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then( m => m.PasswordResetPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'user-settings',
    loadChildren: () => import('./pages/user-settings/user-settings.module').then( m => m.UserSettingsPageModule)
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
