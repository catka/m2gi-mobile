import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import firebase from 'firebase';
import User = firebase.User;
import {MenuController, ToastController} from '@ionic/angular';

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
