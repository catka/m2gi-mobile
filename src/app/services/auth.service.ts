import { PhotoService } from './photo.service';
import { AccountInfo } from './../models/accountInfo';
import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFirestore} from '@angular/fire/firestore';
import {Subject, BehaviorSubject} from 'rxjs';
import firebase from 'firebase';
import {Plugins} from '@capacitor/core';
import {AccountInfoService} from './account-info.service';
import User = firebase.User;
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from './language.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user$: BehaviorSubject<firebase.User>;

    constructor(private afAuth: AngularFireAuth,
                private af: AngularFirestore, private accountInfoService: AccountInfoService, private router: Router, private languageService: LanguageService, private photoService: PhotoService) {

        this.user$ = new BehaviorSubject(null);
        this.afAuth.onAuthStateChanged(user => {
                this.user$.next(user);
                // If sign in
                if (user){
                    // Search for user
                    this.accountInfoService.getOneObs(user.uid).subscribe(
                        (snapshot) => {
                            languageService.setLanguage(snapshot.prefLanguage);
                            if (snapshot.sudoName === undefined || snapshot.photoUrl === undefined){
                                // Create user settings w/ default sudo name and redirect to user settings to change it
                                this.updateAccountInfoWhenEmpty(snapshot, user).then(() => {
                                    if (user.emailVerified) this.router.navigateByUrl('/user-settings');
                                    else this.logout();
                                });
                            }
                            
                        },
                        (error) => console.log(error)
                    );
                }
        }
    );
    }

    // Create sudo name using email in firebase
    async updateAccountInfoWhenEmpty(accountInfo: AccountInfo, user: User) {
        if (!accountInfo.photoUrl) {
            if(user.photoURL)
                accountInfo.photoUrl = user.photoURL;
            else
                accountInfo.photoUrl = await this.photoService.getDefaultUserPicture();
        }
        if (!accountInfo.sudoName) {
            accountInfo.sudoName = user.displayName ? user.displayName : 'Pseudo - ' + user.uid.substring(0, 4);
        }
        return this.accountInfoService.createOrUpdate(accountInfo, user.uid + '');
    }

    getConnectedUser() {
        return this.user$.asObservable();
    }

    async login(email: string, password: string) {
        // TODO : CHECK IF ACCOUNTINFO EXISTS - IF NOT, CREATE ONE!
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
        // let pseudo = googleUser.name;
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
    // Warning: unused
    // getLoggedInUser(): string {
    //     // return 'AzzaujI8wCcnXJujpOBrhVKLYOP2';
    //     return this.afAuth.idToken;
    // }

    // // TODO :: THIS NEEDS TO BE ACTUAL AVAILABLE USERS
    // getAllUserIds(): string[] {
    //     return [
    //         'AzzaujI8wCcnXJujpOBrhVKLYOP2',
    //         'cNeSKu5b27MKxPFJMIkXD4GEvS62',
    //     ];
    //
    // }

}






