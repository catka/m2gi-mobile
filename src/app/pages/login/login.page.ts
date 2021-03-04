import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import firebase from 'firebase';
import { AuthService } from '../../services/auth.service';
import { Plugins } from '@capacitor/core';
import '@codetrix-studio/capacitor-google-auth';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup = new FormGroup({});

    constructor(private _fb: FormBuilder, public  afAuth: AngularFireAuth, private router: Router, public toastController: ToastController, public authService: AuthService) {
    }

    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required],
        });
        this.afAuth.getRedirectResult().then((userCredential) => {
            if (userCredential.user !== null){
                this.showToast('Logged in with Facebook.', false);
                this.router.navigateByUrl('home');
            }
        }).catch((error) => {
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log('login successful');
                    this.showToast(user.email + ' logged in successfully', false);
                    this.router.navigateByUrl('home');
                })
                .catch((error) => {
                    console.log('error logging in, code = ' + error.code + ', message = ' + error.message);
                    const errorCode = error.code;
                    if (errorCode === 'auth/user-not-found') {
                        this.showToast('Email not found', true);
                    } else if (errorCode === 'auth/wrong-password') {
                        this.showToast('Incorrect Password', true);
                    } else if (errorCode === 'auth/user-disabled') {
                        this.showToast('Cannot login as a disabled user', true);
                    } else {
                        this.showToast('Login unsuccessful', true);
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

    goToRegister() {
        this.router.navigateByUrl('register');
    }

    goToResetPassword() {
        this.router.navigateByUrl('password-reset');
    }

    async googleLogin() {
        await this.authService.googleLogin();
        return this.router.navigateByUrl('home');
    }
}
