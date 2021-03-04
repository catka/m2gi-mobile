import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subject, BehaviorSubject} from 'rxjs';
import firebase from 'firebase';
import {Plugins} from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private user$: BehaviorSubject<firebase.User>;

    constructor(private afAuth: AngularFireAuth,
                private af: AngularFirestore) {

        this.user$ = new BehaviorSubject(null);
        this.afAuth.onAuthStateChanged(user =>
            this.user$.next(user));
    }

    getConnectedUser() {
        return this.user$.asObservable();
    }

    async login(email: string, password: string) {
        return await this.afAuth.signInWithEmailAndPassword(email, password);
    }

    // TODO : NEED TO ADD THIS FUNCTIONALITY
    async logout() {
        return await this.afAuth.signOut();
    }

    async register(email: string, password: string) {
        const cred = await this.afAuth.createUserWithEmailAndPassword(
            email,
            password
        );

        await cred.user.sendEmailVerification();
        return cred.user;
    }

    async sendPasswordResetEmail(username: string) {
        return await this.afAuth.sendPasswordResetEmail(username);
    }

    async googleLogin() {
        let googleUser = await Plugins.GoogleAuth.signIn() as any;
        const credential = firebase.auth.GoogleAuthProvider.credential(googleUser.authentication.idToken);
        return this.afAuth.signInAndRetrieveDataWithCredential(credential);
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
    getLoggedInUser(): string {
        return 'AzzaujI8wCcnXJujpOBrhVKLYOP2';
        // return this.afAuth.idToken;
    }

    // TODO :: THIS NEEDS TO BE ACTUAL AVAILABLE USERS
    getAllUserIds(): string[] {
        return [
            'AzzaujI8wCcnXJujpOBrhVKLYOP2',
            'cNeSKu5b27MKxPFJMIkXD4GEvS62',
        ];

    }

}






