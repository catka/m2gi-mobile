# ToDo List Application

## Internationalization
Translations stored in the assets/i18n folder. This is set to the default browser lang (TranslatorService.getBrowserLang()) or en otherwise.

The user can change this in the account settings page.

Get translate in typescript: this.translate.instant('translate_key');
Get translate in html: {{ "translate_key" | translate }}