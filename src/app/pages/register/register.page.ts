import { matchingPasswordsValidator } from './../../validators/matching-password-validator';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';
import {AuthService} from '../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private _fb: FormBuilder, private toastController: ToastController, private router: Router, private location: Location, public auth: AngularFireAuth, private authService: AuthService, private translate: TranslateService) { }

  ngOnInit() {
    this.registerForm = this._fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
    }, {validators: [matchingPasswordsValidator]});
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const user = await this.authService.register(this.registerForm.get('username').value,
        this.registerForm.get('password').value);
        this.showToastWithKey('alerts.login.user_created', false, {user : user.email});
        await this.router.navigateByUrl('login');
      } catch (e) {
        await this.showToast(e.message, true);
      }
    }
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

  back() {
    this.location.back();
  }
}
