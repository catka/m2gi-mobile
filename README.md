# ToDo List Application

## Firestore Documents
### accountInfo
Contains account information, including firebase user uid, pseudonym (used to identify users when sharing), language and a profile photo url.

The photo url is typically a link to a photo stored in the following locations:

+ <b>Firebase</b>  (https://firebasestorage....): For uploaded photos in the application i.e. taken by camera or uploaded from file.
+ <b>Google</b>    (https://lh3.googleusercont.): For uploaded photos on linked to a google account
+ <b>Facebook</b>  (https://graph.facebook.....): For uploaded photos on linked to a facebook account

### lists
Lists contain name, owner accountInfo reference, description, sharing information (read & write) & todos document collection.
#### Sharing
Both read and write are collections of references to accountInfo documents. This allows easy identification of shared users with the accountInfo document Id equal to the firebase user uid.

#### todos
Contains the name, description, created date, if it's done and location information (address and corresponding geopoint)

## Firestore Rules

See Microsoft Teams channel *Group 2* file uploads for the commented firestore rule code included in firestore for lists, todos and accountInfo.

## Ionic application

For development the envionrment.ts is needed, see Microsoft Teams channel *Group 2* to access this file.

### Authentication

A user can login in a few different ways:

#### Normal Login
Users can register an account in firebase with an email and password. They can then login with these credentials on the login page.

If the user forgets the password they also have the option of resetting their password.

##### Form advanced validation
On registering on the app with an email/password, a custom form validator is used to check the matching of the two passwords.

#### Google
#### Facebook

Facebook done on redirect. User email not verified by default (see https://github.com/firebase/firebase-js-sdk/issues/340), therefore we've added a condition to pass emailVerification when the provider id is facebook.

#### Guard

Unauthenticated users cannot access pages other than login. The authguard service canActivate method is run on all other routes to check this.

### Internationalization
<b>@ngx-translate/core and @ngx-translate/http-loader</b> used to allow for multiple languages. Translations are stored in the assets/i18n folder. 

The user can change the application language in the account settings page and is stored in firebase under the accountInfo document associated with their uid.

+ Get translated text in typescript: this.translate.instant('translate_key', parametersJsonArray);
+ Get translate in html: {{ "translate_key" | translate }}
+ Or with key {{'login_form.options.login_with' | translate:{'keyName': 'KeyValue'} }}

### Firebase Firestorage of images for user profile pictures + camera
Within the account settings page a user can upload a profile picture from file or with the devices camera. This image is saved in Firebase (note that the on Google authentication the image is set to the default Google profile picture on first connection). 

The <b>@ionic/pwa-elements</b> plugin has been included in order to use the camera when in the web environment.


The URL is stored in the accountInfo document in firestore associated with their uid.

The profile picture is typically used for sharing. Displayed next to the users pseudonym when searching for users to share a list with (read or write). It is also displayed in the home page, with the profile picture of  the sharing user appearing on the right hand side of the list name.


### Ionic 4 Autocomplete
When a user wants to share his list to other users, an autocomplete list helps them find other users.
This is an implementation of the package: https://www.npmjs.com/package/ionic4-auto-complete


### Localisation
#### Address and Api geocoding

+ A user can choose a location of a todo with specifying an address in the todo form.
+ An <b>API call to is used to geocode</b> the address and the lat and long are saved as a GeoPoint in firebase.

<b>positionstack.com</b> was used instead of the google geocoder as the first 25,000 calls a free. The reason for using this over the commonly used google geocoder as we found two issues with it:

+ The google geocoder plugin is only supported with cordova which should be avoided with new ionic applications
+ The billing information is required to setup an API key. 

For positionstack, the billing information was not required. It should be noted however that the free subscription for positionstack.com doesn't not use a SSL/TLS handshake call. For production, a paid subscription would be needed (or it could easily be replaced by another API).

#### Distance calculation using Capacitor geolocation


+ If the owner/sharing user views the todo, they will be able to estimate how far away they are from the Todo location using the <b>Capacitor geolocation plugin</b> and comparing with the GeoPoint. 
+ There is also a link to open the location with google maps on the to-do details page.


### Custom Icon and splash screen

Splash screen from: <a href='https://fr.freepik.com/vecteurs/affaires'>Affaires vecteur créé par jcomp - fr.freepik.com</a>

#### Images:

![App Icon](android/app/src/main/res/mipmap-hdpi/ic_launcher.png)
![Splash Screen](android/app/src/main/res/drawable/splash.png)
