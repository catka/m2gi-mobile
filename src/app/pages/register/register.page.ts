import { matchingPasswordsValidator } from './../../validators/matching-password-validator';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;

  constructor(private _fb: FormBuilder, private toastController: ToastController, private router: Router, private location: Location, public auth: AngularFireAuth) { }

  ngOnInit() {
    this.registerForm = this._fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]]
      // TODO: add validator for password match
    }, {validators: [matchingPasswordsValidator]});
  }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.showToast('Form is not valid! Please check your input an try again.', true);
    } else {
      // TODO: register with firebase
      this.auth.createUserWithEmailAndPassword(this.registerForm.get('username').value, this.registerForm.get('password').value).then((result) => {
        console.log(result);
        if (result && result.operationType) {
          this.showToast("Operation successful: " + result.operationType, false);
          this.router.navigateByUrl('home');
        }
      }, (reject) => {
          this.showToast("Registration failed: " + reject.message, true);
      });
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
