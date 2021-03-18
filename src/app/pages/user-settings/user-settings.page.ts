import { UserSettingsImagePopoverComponent } from './../../modals/user-settings-image-popover/user-settings-image-popover.component';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AccountInfoService } from '../../services/account-info.service';
import { Observable } from 'rxjs';
import { AccountInfo } from '../../models/accountInfo';
import firebase from 'firebase';
import User = firebase.User;
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopoverController, ToastController } from '@ionic/angular';
import { LanguageService } from '../../services/language.service';
import { map } from 'rxjs/operators';
import {LocationService} from '../../services/location.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.page.html',
    styleUrls: ['./user-settings.page.scss'],
})
export class UserSettingsPage implements OnInit {

    public userSettingsForm: FormGroup = new FormGroup({});
    public user: User;
    public pseudoName: string;
    public accountInfo$: Observable<AccountInfo>;
    public languages = [];
    photoUrl$: Observable<string>;
    oldPhotoUrl: string = null;
    newPhotoUrl: string = null;

    constructor(private _fb: FormBuilder, private auth: AuthService, private router: Router, private accountInfoService: AccountInfoService, public toastController: ToastController, private languageService: LanguageService, public popoverController: PopoverController, private translate: TranslateService) {
        this.userSettingsForm = this._fb.group({
            sudoName: ['', Validators.required],
            prefLanguage: []
        });
    }

    ngOnInit() {
        this.languages = this.languageService.getAvailableLanguages();
        // TODO : CLEAN THIS UP - USE AUTH SERVICE VARIABLE?
        this.auth.getConnectedUser().subscribe(user => {
            this.user = user;
            if (user) {
                // Search for user
                this.accountInfo$ = this.accountInfoService.getOneObs(user.uid);
                this.photoUrl$ = this.accountInfo$.pipe(map((ai) => ai.photoUrl));
                this.accountInfo$.subscribe((accountInfo) => {
                    this.userSettingsForm.patchValue(accountInfo);
                });
                this.photoUrl$.subscribe((p) => this.oldPhotoUrl = p);
                // this.accountInfo = this.accountInfoService.getOneObs(user.uid);
            } else {
                this.accountInfo$ = null;
            }
        });
    }


    async onSubmit(id) {
        if (this.userSettingsForm.valid) {
            try {
                const userSettings = new AccountInfo(this.userSettingsForm.get('sudoName').value, this.userSettingsForm.get('prefLanguage').value);
                userSettings.id = id;
                userSettings.photoUrl = this.oldPhotoUrl;
                if (this.newPhotoUrl) {
                    userSettings.photoUrl = this.newPhotoUrl;
                }
                await this.accountInfoService.createOrUpdate(userSettings, id);
                this.showToastWithKey('alerts.user_settings.updated', false);
                this.router.navigateByUrl('home');
            } catch (error) {
                this.showToastWithKey('alerts.user_settings.error', true);
            }
        } else {
            this.showToastWithKey('alerts.user_settings.invalid', true);
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

    async imagePopover(ev: any) {
        const popover = await this.popoverController.create({
            component: UserSettingsImagePopoverComponent,
            componentProps: {uid: this.user.uid, photoUrl$: this.photoUrl$},
            cssClass: 'popover-img',
            event: ev,
            translucent: true
        });
        popover.onDidDismiss().then((result) => {
            if (result && result.data) {
                this.photoUrl$ = result.data;
                result.data.subscribe((p) => { if (p) this.newPhotoUrl = p });
            }
        });
        return await popover.present();
    }
}
