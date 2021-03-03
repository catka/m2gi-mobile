import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})

export class AuthService {

    constructor(
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        private router: Router
    ) {
    }

// Sign in with Facebook
    FacebookAuth() {
        return this.AuthLogin(new firebase.auth.FacebookAuthProvider());
    }

// Auth logic to run auth providers
    AuthLogin(provider) {
        return this.afAuth.signInWithRedirect(provider);
    }

    // TODO :: THIS NEEDS TO BE ACTUAL LOGGED IN USER
    getLoggedInUser(): string{
        return 'AzzaujI8wCcnXJujpOBrhVKLYOP2';
        // return this.afAuth.idToken;
    }

    // TODO :: THIS NEEDS TO BE ACTUAL AVAILABLE USERS
    getAllUserIds(): string[]{
        return [
            'AzzaujI8wCcnXJujpOBrhVKLYOP2',
            'cNeSKu5b27MKxPFJMIkXD4GEvS62',
        ];

    }

}