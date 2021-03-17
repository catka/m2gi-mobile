# ToDo List Application

## Environment parameters
See Microsoft Teams channel *Group 2* for the environment files.

## Form advanced validation
On registering on the app with an email/password, a custom form validator was set up to check the matching of the two passwords.

## Internationalization
Translations stored in the assets/i18n folder. This is set to the default browser lang (TranslatorService.getBrowserLang()) or en otherwise.

The user can change this in the account settings page.

Get translate in typescript: this.translate.instant('translate_key');
Get translate in html: {{ "translate_key" | translate }}

## Localisation

+ A user can choose a location of a todo with specifying an address in the todo form.
+ An API call to is used to geocode the address and the lat and long are saved as a GeoPoint in firebase.
+ If the owner/sharing user views the todo, they will be able to estimate how far away they are from the Todo location using the Capacitor geolocation plugin and comparing with the GeoPoint. 
+ There is also non-native link to open the location with google maps on the to-do details page.

positionstack.com was used instead of the google geocoder as the first 25,000 calls a free. Even though there is a free amount with the google geocoder we found two issues with it:
+ The geocoder plugin is only supported with cordova which should be avoided with new ionic applications
+ The billing information is required to setup an API key. 

It should be noted however that the free subscription for positionstack.com doesn't not use a TLS handshake call. For production, a paid subscription would be needed (or it could easily be replaced by another API).

## Firebase Firestorage of images for user profile pictures + camera
User can upload a picture file (from file selection) or take a new picture (with the camera), which will be saved in Firebase/Firestore (base image is Google profile picture if the user signed with Google). It is retreived by URL and display in the app.
A plugin (@ionic/pwa-elements) was included to have the camera working on the web app environment.

## Authentification
### Normal Login
### Google
### Facebook

Facebook done on redirect. User email not verified by default (see https://github.com/firebase/firebase-js-sdk/issues/340), therefore we've added a condition to pass emailVerification when the provider id is facebook.