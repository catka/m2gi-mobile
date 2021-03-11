import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor(private translate: TranslateService) { }

  setInitLanguage(): void{
    const lang = this.translate.getBrowserLang() ? this.translate.getBrowserLang() : 'en';
    this.translate.setDefaultLang(lang);
  }
  //
  // getLang(): string {
  //   return this.translate.currentLang;
  // }

  getAvailableLanguages()
  {
    return [
      {key: 'en', value: 'English'},
      {key: 'fr', value: 'Français'},
    ];
  }

  setLanguage(lang){
    this.translate.use(lang);
  }

}
