import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocationService {

    positionStackApiUrl = 'http://api.positionstack.com';
    readonly ADDRESS_NOT_FOUND_ERROR = 'Empty list of addresses returned';
    constructor(public httpClient: HttpClient) {
    }

    geocode(address: string): Promise<any>
    {
        const geocodeUrl = `${this.positionStackApiUrl}/v1/forward?access_key=${environment.positionstack.apiKey}&query=${address}`;
        // this.httpClient.get(geocodeUrl).subscribe((data) => {
        //   const lat = data.data[0].latitude;
        //   const long = data.data[0].longitude;
        //   debugger;
        // });
        return (this.httpClient.get(geocodeUrl).pipe(
            map((data: any) => {
                    // Api can potentially return an empty data set for an address not found
                    if (!data || data.data.length === 0){
                        throw new Error(this.ADDRESS_NOT_FOUND_ERROR);
                    } else{
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

    // this.locationService.geocode('105 allée des érables, Crolles');
    // this.locationService.reverseGeocode("45.282077", '5.882938');
    // this.locationService.geocode('sdagbfdvadfvbsfdavsfdv');
    // this.locationService.reverseGeocode("2342342323", '-23423423');
    // this.listService.getAll().subscribe((newList) => this.debugList(newList));

}
