import { AuthService } from 'src/app/services/auth.service';
import { AccountInfoService } from './account-info.service';
import { AccountInfo } from './../models/accountInfo';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {map} from 'rxjs/operators';

import {AutoCompleteService} from 'ionic4-auto-complete';

@Injectable()
export class AccountInfoAutocompleteService implements AutoCompleteService {
  private accountInfos: Observable<AccountInfo[]>;

  constructor(
    private accountInfoService: AccountInfoService,
    private authService: AuthService
  ) {

  }

  getResults(keyword?:string):Observable<any[]> {
    keyword = typeof keyword === 'string' ? keyword : '';

    if (!this.accountInfos) {
      this.accountInfos = this.accountInfoService.getAll();
    }

    return this.accountInfos.pipe(
      map(
        (result) => {
          return result.filter(
            (item) => item.id != this.authService.getConnectedAccountInfo().id
          ).filter(
            (item) => {
              return item.sudoName.toLowerCase().startsWith(
                  keyword.toLowerCase()
              );
            }
          );
        }
      )
    );
  }
}