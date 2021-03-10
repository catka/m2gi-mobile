import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';
import {AuthService} from './auth.service';
import firebase from 'firebase';
import User = firebase.User;
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];

  private owningCollection: AngularFirestoreCollection<List> = null;
  private readSharedCollection: AngularFirestoreCollection<List> = null;
  private writeSharedCollection: AngularFirestoreCollection<List> = null;
  public user: User;

  constructor(private af: AngularFirestore, private authService: AuthService) {
    this.getLists();
  }

  private getLists() {
    // TODO : IS THERE A WAY TO MAKE THIS CLEANER??
    this.authService.getConnectedUser().subscribe(user => {
      // Cannot have 'OR' queries in Firebase
      if (user && user.uid){
        this.owningCollection = this.af.collection('lists', ref => ref.where('owner', '==', user.uid));
        this.readSharedCollection = this.af.collection('lists', ref => ref.where('canRead', 'array-contains', user.uid));
        this.writeSharedCollection = this.af.collection('lists', ref => ref.where('canWrite', 'array-contains', user.uid));
      }
    });
    
    // GET ALL FOR DEBUGGING
    // this.listCollection = this.af.collection('lists');
  }


  getAll(): Observable<List[]> {
    return combineLatest(this.owningCollection.snapshotChanges(), this.readSharedCollection.snapshotChanges(), this.writeSharedCollection.snapshotChanges()).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur))),
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
