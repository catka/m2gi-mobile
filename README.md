# ToDo List Application

## Internationalization
Translations stored in the assets/i18n folder. This is set to the default browser lang (TranslatorService.getBrowserLang()) or en otherwise.

The user can change this in the account settings page.

Get translate in typescript: this.translate.instant('translate_key');
Get translate in html: {{ "translate_key" | translate }}

## Localisation

+ A user can choose a location of a todo with specifying an address in the todo form.
+ An API call to is used to geocode the address and the lat and long are saved as a GeoPoint in firebase.
+ If the owner/sharing user views the todo, they will be able to calculate how far away they are from the Todo location using the Capacitor geolocation plugin. 

positionstack.com was used instead of the google geocoder as the first 25,000 calls a free. Even though there is a free amount with the google geocoder we found two issues with it:
+ The geocoder plugin is only supported with cordova which should be avoided with new ionic applications
+ The billing information is required to setup an API key. 

It should be noted however that the free subscription for positionstack.com doesn't not use a TLS handshake call. For production, a paid subscription would be needed (or it could easily be replaced by another API).

A lat and long (GeoPoint in firebase) and an address.
A user can save a todos 
