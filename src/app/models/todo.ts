import firebase from 'firebase';
import GeoPoint = firebase.firestore.GeoPoint;

export class Todo {
  id: string;
  name: string;
  description: string;
  isDone: boolean = false;
  createdAt: any = new Date().getTime();
  private location: GeoPoint;
  address: string;

  constructor(name?: string, description?: string) {
    this.name = name;
    if(description)
      this.description = description;
  }

  public setLocationWithLatAndLong(lat: number, long: number){
    this.setLocation(new GeoPoint(lat, long));
  }

  public setLocation(location: GeoPoint){
    this.location = location;
  }

}
