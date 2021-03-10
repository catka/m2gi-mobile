import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {ListService} from '../../services/list.service';
import {Location} from '@angular/common';
import {TodoService} from '../../services/todo.service';
import {AccountInfoService} from '../../services/account-info.service';
import {filter} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {AccountInfo} from '../../models/accountInfo';
import firebase from 'firebase';
import User = firebase.User;
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Todo} from '../../models/todo';
import {ToastController} from '@ionic/angular';

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

    constructor(private _fb: FormBuilder, private auth: AuthService, private router: Router, private listService: ListService, private location: Location, private todoService: TodoService, private accountInfoService: AccountInfoService, public toastController: ToastController) {
        this.userSettingsForm = this._fb.group({
            sudoName: ['', Validators.required]
        });
    }

    ngOnInit() {

        // TODO : CLEAN THIS UP - USE AUTH SERVICE VARIABLE?
        this.auth.getConnectedUser().subscribe(user => {
            this.user = user;
            if (user) {
                // Search for user
                this.accountInfo$ = this.accountInfoService.getOneObs(user.uid);
                this.accountInfo$.subscribe((accountInfo) => {
                    this.userSettingsForm.patchValue(accountInfo);
                });
                // this.accountInfo = this.accountInfoService.getOneObs(user.uid);
            } else {
                this.accountInfo$ = null;
            }
        });
    }


    async onSubmit(id) {
        if (this.userSettingsForm.valid) {
            try{
                const userSettings = new AccountInfo(this.userSettingsForm.get('sudoName').value);
                userSettings.id = id;
                await this.accountInfoService.createOrUpdate(userSettings, id);
                this.showToast('Updated settings successfully.', false);
                await this.router.navigateByUrl('home');
            } catch (error){
                this.showToast('Error submitting settings', true);
            }
        } else {
            this.showToast('Invalid input.', true);
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


}
