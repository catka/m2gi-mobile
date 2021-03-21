import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { filter, flatMap, map, startWith, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ListService } from 'src/app/services/list.service';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase';
import User = firebase.User;
import { Location, TitleCasePipe } from '@angular/common';
import { TodoService } from '../../services/todo.service';
import { AccountInfoService } from '../../services/account-info.service';
import { AccountInfo } from '../../models/accountInfo';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { appInitialize } from '@ionic/angular/app-initialize';
import { of } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  public title$: Observable<any>;
  public user: User;
  public pseudoName: string;
  public accountInfo$: Observable<AccountInfo>;
  private route$: Observable<Event>;
  photoUrl$: Observable<string>;
  routeWithBack$: Observable<boolean>;
  routeLogin = false;

  constructor(private auth: AuthService, private router: Router, private listService: ListService, private location: Location,
    private todoService: TodoService, private accountInfoService: AccountInfoService, private translate: TranslateService, private menu: MenuController) {
    this.route$ = this.router.events.pipe(filter(event => event instanceof NavigationEnd));
  }

  ngOnInit() {
    // TODO : CLEAN THIS UP - USE AUTH SERVICE VARIABLE?
    this.auth.getConnectedUser().subscribe(user => {
      this.user = user;
      if (user) {
        // Search for user
        this.accountInfo$ = this.accountInfoService.getOneObs(user.uid);
        this.photoUrl$ = this.accountInfo$.pipe(map((ai) => ai.photoUrl));

        // this.accountInfo = this.accountInfoService.getOneObs(user.uid);
      } else {
        this.accountInfo$ = null;
      }
    });

    this.title$ = this.route$.pipe(
      startWith(this.translate.instant('home')),
      map((route) => {
        const url = this.router.url;
        const urlSplit = url.split('/');

        return urlSplit;
      }),
      flatMap((urlSplit) => {
        switch (urlSplit[1]) {
          case 'lists':
            if (urlSplit.length > 3) {
              if (urlSplit[3] === 'todos') {
                return this.todoService.getOneObs(urlSplit[4], urlSplit[2]).pipe(
                  map((todo) => todo.name)
                );
              }
            }
            return this.listService.getOneObs(urlSplit[2]).pipe(
              map((list) => list.name)
            );
            break;
          case '':
          case null:
            return this.translate.instant('home');
            break;
          default:
            return of(this.translate.instant(urlSplit[1].replace('-', '_')));
        }
    })
    );
    this.routeWithBack$ = this.route$.pipe(
      map((route) => {
        const url = this.router.url;
        const urlSplit = url.split('/');
        return  !(urlSplit[1] === 'login') && !(urlSplit[1] === 'home');
      }),
      startWith(false)
    );
    this.route$.subscribe((route) => {
      this.routeLogin = this.router.url.split('/')[1] === 'login';
    });
  }

  openEnd() {
    this.menu.open('end');
  }

  back() {
    const urlSplit = this.location.path().split('/');
    if (urlSplit[1] === 'lists') {
      if (urlSplit.length > 3) {
        if (urlSplit[3] === 'todos') {
          return this.router.navigateByUrl(urlSplit.slice(0, 3).join('/'));
        }
      } else if (urlSplit.length === 3 && urlSplit[1] === 'lists'){
        return this.router.navigateByUrl('home');
      }
    }
    return this.location.back();
  }

  textReduce(stringLong) {
    if (stringLong !== null && stringLong.length > 25) {
      return stringLong.substr(0, 22) + '...';
    }
    return stringLong;
  }

}
