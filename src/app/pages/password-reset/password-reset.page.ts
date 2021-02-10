import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {AngularFireAuth} from '@angular/fire/auth';

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.page.html',
    styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {

    resetPasswordForm: FormGroup;

    constructor(private _fb: FormBuilder, private toastController: ToastController, private router: Router, private location: Location, public auth: AngularFireAuth) {
    }

    ngOnInit() {
        this.resetPasswordForm = this._fb.group({
            username: ['', [Validators.required, Validators.email]],
        });
    }

    onSubmit() {
      if (this.resetPasswordForm.valid) {
        const username = this.resetPasswordForm.get('username').value;
        this.auth.sendPasswordResetEmail(username)
            .then(() => {
              this.showToast(`Reset password email sent for user: ${username}`, false);
              this.router.navigateByUrl('login');
            })
            .catch((error) => {
              const errorCode = error.code;
              if (errorCode === 'auth/user-not-found') {
                  this.showToast('User not found', true);
              } else if (errorCode === 'auth/invalid-email') {
                  this.showToast('Email not found', true);
              } else {
                  this.showToast('Login unsuccessful', true);
                  console.log(errorCode);
              }
            });
      } else {
        this.showToast('Invalid inputs.', true);
      }
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
