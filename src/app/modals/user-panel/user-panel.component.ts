import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {AccountInfoService} from '../../services/account-info.service';
import {Observable} from 'rxjs';
import {AccountInfo} from '../../models/accountInfo';
import firebase from 'firebase';
import User = firebase.User;
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuController, ToastController} from '@ionic/angular';
import {LanguageService} from '../../services/language.service';

@Component({
  selector: 'app-user-panel',
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  public user: User;

  constructor(private auth: AuthService, private router: Router, public toastController: ToastController, private menu: MenuController) {
  }

  ngOnInit() {
    // TODO : CLEAN THIS UP - USE AUTH SERVICE VARIABLE?
    this.auth.getConnectedUser().subscribe(user => {
      this.user = user;
    });
  }

  async logout(){
    if (this.user) {
      await this.auth.logout();
    }
    await this.router.navigate(['login']);
    this.menu.close('end');
  }

  toUserSettings(){
    this.router.navigateByUrl('/user-settings');
    this.menu.close('end');
  }
}
