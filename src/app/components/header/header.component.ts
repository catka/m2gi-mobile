import { Component, OnInit } from '@angular/core';
import {Router, NavigationEnd, Event} from '@angular/router';
import {filter, switchMap} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ListService } from 'src/app/services/list.service';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase';
import User = firebase.User;
import {Location} from '@angular/common';
import {TodoService} from '../../services/todo.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {AccountInfoService} from '../../services/account-info.service';
import {List} from '../../models/list';
import {AccountInfo} from '../../models/accountInfo';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public title: string;
  public user: User;
  public pseudoName: string;
  private accountInfo$: Observable<AccountInfo>;
  private route$: Observable<Event>;
  routeWithBack = true;

  constructor(private auth: AuthService, private router: Router, private listService: ListService, private location: Location,
              private todoService: TodoService, private accountInfoService: AccountInfoService, private translate: TranslateService) {
    this.route$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
  }

  ngOnInit() {
    // TODO : CLEAN THIS UP - USE AUTH SERVICE VARIABLE?
    this.auth.getConnectedUser().subscribe(user => {
      this.user = user;
      if (user){
        // Search for user
        this.accountInfo$ = this.accountInfoService.getOneObs(user.uid);

        // this.accountInfo = this.accountInfoService.getOneObs(user.uid);
      } else{
        this.accountInfo$ = null;
      }
    });
    // this.auth.getConnectedUser().pipe(
    //   switchMap((user: User) => this.accountInfoService.getOneObs(user?.uid)
    // ));

    // this.auth.getConnectedUser().subscribe(user => {
    //   this.user = user;
    //   if (user){
    //     // Search for user
    //     this.accountInfo = this.accountInfoService.getOneObs(user.uid);
    //
    //     // this.accountInfo = this.accountInfoService.getOneObs(user.uid);
    //   }
    // });

    this.route$.subscribe(route => {


      // TODO : ADD BACK BUTTON
      // TODO : ADD ROUTE ID SPECIFIC INFO. E.G. TODO NAME
      const url = this.router.url;
      const urlSplit = url.split('/');
      switch (urlSplit[1]) {
        case 'home':
          this.title = 'Home';
          break;
        case 'login':
          this.title = 'Login';
          break;
        case 'register':
          this.title = 'Register';
          break;
        case 'user-settings':
          this.title = this.translate.instant('user_settings');
          // this.title = 'User Settings';
          break;
        case 'password-reset':
          this.title = 'Password Recovery';
          break;
        case 'lists':
          if (urlSplit.length > 3){
            if (urlSplit[3] === 'todos'){
              // TODO : DO WE NEED AN AWAIT HERE?
              this.todoService.getOneObs(urlSplit[4], urlSplit[2]).subscribe(
                  (todo) => this.title = todo && todo.name
              );
              // this.title = 'todo';
              break;
            }
          }
          // this.title = 'List details';
          // TODO : DO WE NEED AN AWAIT HERE?
          this.listService.getOneObs(urlSplit[2]).subscribe(
              (list) => this.title = list && list.name
          );
          // this.title = 'List details';
          break;
        // case 'todos':
        //   this.title = 'Todos';
        //   break;
        // case 'list-details':
        //   const list = this.listService.getOne(url.split('/')[2]);
        //   this.title = list && list.name;
        //   break;
        default:
          console.log(`Unknown url ${url}.`);
      }

      this.routeWithBack = !(urlSplit[1] === 'login') && !(urlSplit[1] === 'home');

    });
  }

  async loginOrOut(){
    if (this.user) {
      await this.auth.logout();
    }
    await this.router.navigate(['login']);
  }

  toUserSettings(){
    this.router.navigateByUrl('/user-settings');
  }

  back() {
    this.location.back();
  }

  textReduce(stringLong){
    if (stringLong !== null && stringLong.length > 25){
      return stringLong.substr(0, 22) + '...';
    }
    return stringLong;
  }

}
