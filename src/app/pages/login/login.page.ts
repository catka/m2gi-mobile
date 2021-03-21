import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import '@codetrix-studio/capacitor-google-auth';
import {TranslateService} from '@ngx-translate/core';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup = new FormGroup({});

    constructor(private _fb: FormBuilder, public  afAuth: AngularFireAuth, private router: Router, public toastController: ToastController, public authService: AuthService, private translate: TranslateService) {
    }

    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required],
        });
        this.afAuth.getRedirectResult().then((userCredential) => {
            if (userCredential.user !== null){
                this.showToastWithKey('alerts.login.logged_in_with_fb', false);
                this.router.navigateByUrl('home');
            }
        }).catch((error) => {
        });

        // If already logged in, go to homepage
        this.authService.getConnectedUser().subscribe((user) => {
            if (user) {
                this.router.navigateByUrl('home');
            }
        })
    }

    login() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    console.log('login successful');
                    if (!user.emailVerified) {
                        this.showToastWithKey('alerts.login.email_confirm', true);
                        return;
                    }
                    this.showToastWithKey('alerts.login.success', false, {user: user.email + ' ' });
                    this.router.navigateByUrl('home');
                })
                .catch((error) => {
                    console.log('error logging in, code = ' + error.code + ', message = ' + error.message);
                    const errorCode = error.code;
                    if (errorCode === 'auth/user-not-found') {
                        this.showToastWithKey('alerts.login.email_not_found', true);
                    } else if (errorCode === 'auth/wrong-password') {
                        this.showToastWithKey('alerts.login.password_error', true);
                    } else if (errorCode === 'auth/user-disabled') {
                        this.showToastWithKey('alerts.login.user_disabled', true);
                    } else {
                        this.showToastWithKey('alerts.login.login_unsuccessful', true);
                    }
                });
        } else {
            this.showToastWithKey('alerts.login.input_error', true);
        }
    }
    async showToastWithKey(translationKey: string, error: boolean, parameters = {}) {
        await this.showToast(this.translate.instant(translationKey, parameters), error);
    }

    async showToast(message: string, error: boolean) {
        const toast = await this.toastController.create({
            message,
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
