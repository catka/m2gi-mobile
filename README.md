# ToDo List Application

## Firestore Documents
### accountInfo
A connected user has an associated firebase user uid - this serves as the unique document Id for the accountInfo document. This document contains information specific to the connected user including their pseudonym (used to identify users when sharing), language and a profile photo url.

The photo url is typically a link to a photo stored in the following locations:

+ <b>Firebase</b>  (https://firebasestorage....): For uploaded photos in the application i.e. taken by camera or uploaded from file.
+ <b>Google</b>    (https://lh3.googleusercont.): For uploaded photos linked to a google account
+ <b>Facebook</b>  (https://graph.facebook.....): For uploaded photos linked to a facebook account

### lists
Lists contain name, owner accountInfo reference, description, sharing information (read & write) & a todos document collection.

Both read and write properties are collections of references to accountInfo documents. This allows easy identification of shared users with the accountInfo document Id equal to the firebase user uid.

#### todos
Contains the name, description, created date, if it's done and location information (address and corresponding lat & long geopoint).

## Firestore Rules

See Microsoft Teams channel *Group 2* file uploads for the commented firestore rule code included in firestore to restrict access to lists, todos and accountInfo.

## Ionic application

For development the envionrment.ts is needed, see Microsoft Teams channel *Group 2* to access this file.

### Authentication

A user can connect to the application in a few different ways. The bulk of this code is contained within the src/app/pages/login & src/app/services/auth.service.ts directories.

#### Normal Login
Users can register an account in firebase with an email and password. They can then login with these credentials on the login page.

If the user forgets the password they also have the option of resetting their password.

##### Form advanced validation
On registering on the app with an email/password, a custom form validator is used to check the matching of the two passwords (see src/app/validators/matching-password-validator.ts)

#### Google

Google connection setup using the instructions in microsoft teams (configuration with google-services.json & implementation with <b>@codetrix-studio/capacitor-google-auth</b>).

#### Facebook

Facebook connection done on redirect. User email not verified by default (see https://github.com/firebase/firebase-js-sdk/issues/340), therefore we've added a condition to pass emailVerification when the provider id is facebook.

#### Guard

Unauthenticated users cannot access pages other than login. The authguard service (src/app/guard/auth-guard.guard.ts) canActivate method is run on all other routes to check this (see src/app/app-routing.module.ts).

### Internationalization

Internationalization allows for people that use different languages to navigate throughout the application easily. English and French translations have been setup in this application (although other languages can easily be added).

<b>@ngx-translate/core and @ngx-translate/http-loader</b> have been used for setting up multiple language support. Translations for each language are stored in json files contained within the assets/i18n folder (e.g. en.json). 

The user can change the application language in the account settings page and is stored in firebase under the accountInfo document associated with their uid.

Usage of translation keys in the code (parameters can also be passed into the translation): 

+ Get translated text in typescript: this.translate.instant('translate_key', {paramName: paramValue});
+ Get translate in html: {{ "translate_key" | translate }}
+ Or with parameter(s) {{'login_form.options.login_with' | translate:{'paramName': 'paramValue'} }}

An example of this can be found in the login.page.ts where an alert is shown on login success, passing in the username to be shown in the alert:
+ Lines 55 & 75 in src/app/pages/login/login.page.ts
+ Using the translation in line 106 in src/assets/i18n/en.json or src/assets/i18n/fr.json

### Firebase Firestorage of images for user profile pictures + camera

Adding a profile picture is another way for other users to identify another. It also adds to the asthetics and personalisation of the application. 

Within the account settings page a user can upload a profile picture from file or with the devices camera. This image is saved in Firebase (note that on Google authentication the image is set to the default Google profile picture on first connection). 

The <b>@ionic/pwa-elements</b> plugin has been included in order to use the camera when in the web environment.


The URL is stored in the accountInfo document in firestore associated with their uid.

The profile picture is typically used for sharing. Displayed next to the users pseudonym when searching for users to share a list with (read or write). It is also displayed in the home page, with the profile picture of  the sharing user appearing on the right hand side of the list name.


### Ionic 4 Autocomplete
When a user wants to share his list to other users, an autocomplete list helps them easily find other users. This makes it much quicker to search for user especially when there is a lot of registered users. See line 25 of src/app/modals/create-list/create-list.component.html for an example using the ion-auto-complete tag.

This is an implementation of the package: https://www.npmjs.com/package/ionic4-auto-complete.


### Localisation

A user may be more inclined to do a task if it is not far away. Allowing geocoding of the address and geolocation allows users to identify the distance of the task from their location.

The bulk of the code used for this service is with the src/app/services/location.service.ts class.

#### Address and Api geocoding

+ A user can choose a location of a todo with specifying an address in the todo form.
+ An <b>API call is used to geocode</b> the address and the lat and long are saved as a GeoPoint in firebase.

<b>positionstack.com</b> was used instead of the google geocoder as the first 25,000 calls a free. The reason for using this over the commonly used google geocoder as we found two issues with it:

+ The google geocoder plugin is only supported with cordova which should be avoided with new ionic applications
+ The billing information is required to setup an API key. 

For positionstack, the billing information was not required. It should be noted however that the free subscription for positionstack.com doesn't not use a SSL/TLS handshake call. For production, a paid subscription would be needed (or it could easily be replaced by another API).

#### Distance calculation using Capacitor geolocation


+ If the owner/sharing user views the todo, they will be able to estimate how far away they are from the Todo location using the <b>Capacitor geolocation plugin</b> and comparing with the GeoPoint. 
+ There is also a link to open the location with google maps on the to-do details page.


### Custom Icon and splash screen

<b>@ionic-native/splash-screen/ngx</b> used for implementing the splash screen.

Splash screen image taken from: <a href='https://fr.freepik.com/vecteurs/affaires'>Affaires vecteur créé par jcomp - fr.freepik.com</a>


#### Images
##### App icon:
![App Icon](android/app/src/main/res/mipmap-hdpi/ic_launcher.png)
##### Splash screen image:
![Splash Screen](android/app/src/main/res/drawable/splash.png)



### RxJS examples
Examples of using the event-based operations library can be found in the following classes (<b>these are just single examples - RxJS has been used in many places within the codebase)</b>:
+  <b>filter, flatMap, map, startWith, of</b>: src/app/components/header/header.component.ts
+  <b>tap</b>: src/app/services/list.service.ts
+  <b>switchMap, combineLatest</b>: src/app/pages/list-details/list-details.page.ts
+  <b>from</b>: src/app/services/location.service.ts