# ToDo List Application

## Environment parameters
See Microsoft Teams channel *Group 2* for the environment files.

## Firestore Documents
### accountInfo
Contains account information, including firebase user uid, pseudonym (used to identify users when sharing)
### list
Lists contain name, owner id, description, sharing information (read & write) & todos document collection
#### Sharing
Both read and write are collections of references to accountInfo documents. This allows easy identification of shared users with the accountInfo document Id equal to the firebase uid.

#### todos
Contains the name, description, if it's done and location information (address and corresponding geopoint)

## Firestore Rules


## Ionic application

### Authentication

A user can login in a few different ways

#### Normal Login
Users can register an account in firebase with an email and password. They can then login with these credentials on the login page

##### Form advanced validation
On registering on the app with an email/password, a custom form validator was set up to check the matching of the two passwords.

If the user forgets the password they also have the option of resetting their password

#### Google
#### Facebook

Facebook done on redirect. User email not verified by default (see https://github.com/firebase/firebase-js-sdk/issues/340), therefore we've added a condition to pass emailVerification when the provider id is facebook.

#### Guard

Unauthenticated users cannot access pages other than login. The authguard service canActivate method is run on all other routes to check this.

### Internationalization
Translations are stored in the assets/i18n folder. 

The user can change the application language in the account settings page.

Get translate in typescript: this.translate.instant('translate_key');
Get translate in html: {{ "translate_key" | translate }}

### Firebase Firestorage of images for user profile pictures + camera
Within the account settings page a user can also upload a picture from file or take a new picture (with the camera). This is saved in Firebase/Firestore (note that the on Google authentication the image is set to the default Google profile picture on first connection). It is retrieved via URL and displayed in the app.
The @ionic/pwa-elements plugin has been included in order to use the camera when in the web environment.


### Localisation

+ A user can choose a location of a todo with specifying an address in the todo form.
+ An API call to is used to geocode the address and the lat and long are saved as a GeoPoint in firebase.
+ If the owner/sharing user views the todo, they will be able to estimate how far away they are from the Todo location using the Capacitor geolocation plugin and comparing with the GeoPoint. 
+ There is also non-native link to open the location with google maps on the to-do details page.

positionstack.com was used instead of the google geocoder as the first 25,000 calls a free. Even though there is a free amount with the google geocoder we found two issues with it:
+ The geocoder plugin is only supported with cordova which should be avoided with new ionic applications
+ The billing information is required to setup an API key. 

It should be noted however that the free subscription for positionstack.com doesn't not use a TLS handshake call. For production, a paid subscription would be needed (or it could easily be replaced by another API).

### Ionic 4 Autocomplete
When a user wants to share his list to other users, an autocomplete list helps them find other users.
This is an implementation of the package: https://www.npmjs.com/package/ionic4-auto-complete

### Custom Icon and splash screen
Splash screen from: <a href='https://fr.freepik.com/vecteurs/affaires'>Affaires vecteur créé par jcomp - fr.freepik.com</a>