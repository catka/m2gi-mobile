import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {from, Observable, pipe} from 'rxjs';
import {Geolocation, GeolocationPosition} from '@capacitor/core';
import firebase from 'firebase';
import GeoPoint = firebase.firestore.GeoPoint;

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  positionStackApiUrl = 'http://api.positionstack.com';
  readonly ADDRESS_NOT_FOUND_ERROR = 'Empty list of addresses returned';

  constructor(public httpClient: HttpClient) {
  }

  // watchPosition() {
  //   const wait = Geolocation.watchPosition({}, (position, err) => {
  //   });
  // }

  distanceFromCurrentPositionInKm(destination: GeoPoint): Observable<number>
  {
    return from(Geolocation.getCurrentPosition()).pipe(map((currentPosition: GeolocationPosition) => {
      return this.calculateDistanceKm(currentPosition.coords.latitude, currentPosition.coords.longitude,
                    destination.latitude, destination.longitude);
    }));
  }

  private calculateDistanceKm(lat1: number, long1: number, lat2: number, long2: number): number
  {
    const p = 0.017453292519943295;    // Math.PI / 180
    const c = Math.cos;
    const a = 0.5 - c((lat1 - lat2) * p) / 2 + c(lat2 * p) * c((lat1) * p) * (1 - c(((long1 - long2) * p))) / 2;
    return Math.round((12742 * Math.asin(Math.sqrt(a)))); // 2 * R; R
  }


  geocode(address: string): Promise<any> {
    const geocodeUrl = `${this.positionStackApiUrl}/v1/forward?access_key=${environment.positionstack.apiKey}&query=${address}`;
    // this.httpClient.get(geocodeUrl).subscribe((data) => {
    //   const lat = data.data[0].latitude;
    //   const long = data.data[0].longitude;
    //   debugger;
    // });
    return (this.httpClient.get(geocodeUrl).pipe(
      map((data: any) => {
          // Api can potentially return an empty data set for an address not found
          if (!data || data.data.length === 0) {
            throw new Error(this.ADDRESS_NOT_FOUND_ERROR);
          } else {
            const lat = data.data[0].latitude;
            const long = data.data[0].longitude;
            return [lat, long];
          }
        }
      )
    )).toPromise();
  }

  reverseGeocode(lat: string, long: string) {
    const reverseGeocodeUrl = `${this.positionStackApiUrl}/v1/reverse?access_key=${environment.positionstack.apiKey}&query=${lat},${long}`;
    // this.httpClient.get(reverseGeocodeUrl).subscribe((data) => {
    //     const address = data.data[0].name;
    //     debugger;
    // });

    this.httpClient.get(reverseGeocodeUrl).pipe(
      map((data: any) => {
          return data.data[0].name;
        }
      )
    );
  }

}
