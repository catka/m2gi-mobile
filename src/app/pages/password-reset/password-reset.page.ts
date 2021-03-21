import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.page.html',
    styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

    resetPasswordForm: FormGroup;

    constructor(private _fb: FormBuilder, private toastController: ToastController, private router: Router, private location: Location, private authService: AuthService, private translate: TranslateService) {
    }

    ngOnInit() {
        this.resetPasswordForm = this._fb.group({
            username: ['', [Validators.required, Validators.email]],
        });
    }

    async onSubmit() {
      if (this.resetPasswordForm.valid) {
          const username = this.resetPasswordForm.get('username').value;
          try {
              await this.authService.sendPasswordResetEmail(username);
              this.showToastWithKey('alerts.login.password_reset', false, {user : username});
              await this.router.navigateByUrl('login');
          } catch (error) {
              const errorCode = error.code;
              if (errorCode === 'auth/user-not-found') {
                  this.showToastWithKey('alerts.login.user_not_found', true);
              } else if (errorCode === 'auth/invalid-email') {
                  this.showToastWithKey('alerts.login.email_not_found', true);
              } else {
                  this.showToastWithKey('alerts.login.login_unsuccessful', true);
                  console.log(errorCode);
              }
          }
      } else{
          this.showToastWithKey(this.translate.instant('alerts.login.input_error'), true);
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
