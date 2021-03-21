import firebase from 'firebase';
import GeoPoint = firebase.firestore.GeoPoint;
import {Observable} from 'rxjs';

export class Todo {
  id: string;
  name: string;
  description: string;
  isDone: boolean = false;
  createdAt: any = new Date().getTime();
  location: GeoPoint;
  address: string;
  distanceFromLocation$: Observable<number>;


  constructor(name?: string, description?: string, address?: string) {
    this.name = name;
    if(description) {
      this.description = description;
    }
    if(address) {
      this.address = address;
    }
  }

  public setLocationWithLatAndLong(lat: number, long: number){
    this.location = new GeoPoint(lat, long);
  }

}
