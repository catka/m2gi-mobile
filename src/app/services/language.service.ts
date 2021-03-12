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

  // TODO : ADD IMAGE WITH FLAG AND LOAD IN FORM
  getAvailableLanguages()
  {
    return [
      {key: 'en', value: 'English'},
      {key: 'fr', value: 'Français'},
    ];
  }

  getAvailableLanguageCodes()
  {
    const codes = [];
    for (const lang of this.getAvailableLanguages()){
      codes.push(lang.key);
    }
    return codes;
  }

  setLanguage(lang){
    if (this.getAvailableLanguageCodes().includes(lang)){
      this.translate.use(lang);
    } else{
      console.log('Language not supported ! ');
    }
  }

}
