import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import firebase from 'firebase';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    public loginForm: FormGroup = new FormGroup({});

    constructor(private _fb: FormBuilder, public  afAuth: AngularFireAuth, private router: Router, public toastController: ToastController) {
    }

    ngOnInit() {
        this.loginForm = this._fb.group({
            email: ['', [Validators.email, Validators.required]],
            password: ['', Validators.required],
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.afAuth.signInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value)
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

// Auth logic to run auth providers
    AuthLogin(provider) {
        return this.afAuth.signInWithRedirect(provider).then((result: any) => {
            this.showToast('FB LOGIN!.', false);

            // const credential = result.credential;
            // // The signed-in user info.
            // const user = result.user;
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            // let accessToken = credential.accessToken;

            // ...
        })
        .catch((error) => {
            this.showToast('FB ERROR!.', false);

            // Handle Errors here.
            // let errorCode = error.code;
            // let errorMessage = error.message;
            // // The email of the user's account used.
            // let email = error.email;
            // // The firebase.auth.AuthCredential type that was used.
            // let credential = error.credential;

            // ...
        });
    }

    fbLogin() {
        const provider = new firebase.auth.FacebookAuthProvider();
        return this.AuthLogin(provider);

        // fbAuth.auth()
        //     .signInWithPopup()
        //     .then((result) => {
        //         /** @type {firebase.auth.OAuthCredential} */
        //         let credential = result.credential;
        //
        //         // The signed-in user info.
        //         let user = result.user;
        //
        //         // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        //         // let accessToken = credential.accessToken;
        //
        //         // ...
        //     })
        //     .catch((error) => {
        //         // Handle Errors here.
        //         let errorCode = error.code;
        //         let errorMessage = error.message;
        //         // The email of the user's account used.
        //         let email = error.email;
        //         // The firebase.auth.AuthCredential type that was used.
        //         let credential = error.credential;
        //
        //         // ...
        //     });
        // // this.showToast('To be implemented', false);
    }

    googleLogin() {
        this.showToast('To be implemented', false);
    }
}
