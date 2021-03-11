export class AccountInfo {
  id: string;
  sudoName: string;
  prefLanguage: string;

  constructor(name: string, prefLanguage: string = 'en') {
    this.sudoName = name;
    this.prefLanguage = prefLanguage;
  }
}
