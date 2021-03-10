import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import firebase from 'firebase';
import User = firebase.User;

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];

  private owningCollection: AngularFirestoreCollection<List>;
  private readSharedCollection: AngularFirestoreCollection<List>;
  public user: User;

  constructor(private af: AngularFirestore, private authService: AuthService) {
    // TODO : IS THERE A WAY TO MAKE THIS CLEANER??
    this.owningCollection = null;
    this.authService.getConnectedUser().subscribe(user => {
      if (user && user.uid){
        this.owningCollection = this.af.collection('lists', ref => {
          return ref.where('owner', '==', user.uid);
          // return t;
        });
      }
    });
    // GET ALL FOR DEBUGGING
    // this.listCollection = this.af.collection('lists');
  }


  getAll(): Observable<List[]> {
    return this.owningCollection?.snapshotChanges().pipe(
        map(actions => this.convertSnapshotData<List>(actions))
    );
  }

  // getOne(id: string): List{
  //   return this.lists.find((l) => l.id === id);
  // }

  getOneObs(id: string): Observable<List>{
    return this.owningCollection?.doc(id + '').snapshotChanges().pipe(
        map(actions => this.convertSingleSnapshotData<List>(actions))
    );
  }

  create(list: List): Promise<void>{
    return this.owningCollection?.doc().set(this.getJSObject(list));
  }

  update(list: List, value): Promise<void>{
    return this.owningCollection?.doc(list.id + '').set(value);
  }

  delete(list: List): Promise<void>{
    return this.owningCollection?.doc(list.id + '').delete();
  }

  private convertSnapshotData<T>(actions){
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      return { id, ...data} as T;
    });
  }
  private convertSingleSnapshotData<T>(actions){
    const data = actions.payload.data();
    const id = actions.payload.id;
    return { id, ...data} as T;
  }

  private getJSObject(customObj: any){
    return Object.assign({}, customObj);
  }
}
