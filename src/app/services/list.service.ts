import { AccountInfo } from './../models/accountInfo';
import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {distinct, map, tap} from 'rxjs/operators';
import {AuthService} from './auth.service';
import firebase from 'firebase';
import User = firebase.User;
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ListService {
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
      if (user && user.uid) {
        let accountRef = this.af.collection('accountInfo').doc(user.uid).ref;
        this.owningCollection = this.af.collection('lists', ref => ref.where('ownerRef', '==', accountRef));
        this.readSharedCollection = this.af.collection('lists', ref => ref.where('canReadRef', 'array-contains', accountRef));
        this.writeSharedCollection = this.af.collection('lists', ref => ref.where('canWriteRef', 'array-contains', accountRef));
      }
    });
    
    // GET ALL FOR DEBUGGING
    // this.listCollection = this.af.collection('lists');
  }


  getAll(): Observable<List[]> {
    return combineLatest([this.owningCollection.snapshotChanges(), this.readSharedCollection.snapshotChanges(), this.writeSharedCollection.snapshotChanges()]).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur))),
      map(actions => this.convertSnapshotData<List>(actions)),
      map((lists) => lists.filter((l, index, self) => index === self.findIndex((findL) => findL.id === l.id))), // removes list duplicates
    );
  }

  getOneObs(id: string): Observable<List>{
    return this.owningCollection?.doc(id + '').snapshotChanges().pipe(
      map(actions => this.convertSingleSnapshotData<List>(actions))
    );
  }

  create(list: List): Promise<void>{
    return this.owningCollection?.doc().set(this.getJSObjectList(list));
  }

  update(list: List, value): Promise<void>{
    return this.owningCollection?.doc(list.id + '').set(this.getJSObjectList(value));
  }

  delete(list: List): Promise<void>{
    return this.owningCollection?.doc(list.id + '').delete();
  }

  private convertSnapshotData<T>(actions){
    return actions.map(a => {
      const data = a.payload.doc.data();
      const id = a.payload.doc.id;
      let t = { id, ...data } as T;
      t = this.convertRefs(t);

      return t;
    });
  }
  private convertSingleSnapshotData<T>(actions){
    const data = actions.payload.data();
    const id = actions.payload.id;
    let t = { id, ...data } as T;

    t = this.convertRefs(t);
    
    return t;
  }

  private convertRefs(t: any) {
    if (t.ownerRef) {
      t.ownerRef.get().then(res => {
        t.owner = res.data();
        t.ownerRef = null;
      });
    }
    if (t.canReadRef) {
      t.canRead = [];
      t.canReadRef.forEach((aiRef) => {
        aiRef.get().then(res => {
          t.canRead.push(res.data());
        });
      });
    }
    if (t.canWriteRef) {
      t.canWrite = [];
      t.canWriteRef.forEach((aiRef) => {
        aiRef.get().then(res => {
          t.canWrite.push(res.data());
        });
      });
    }

    delete (t.ownerRef);
    delete (t.canReadRef);
    delete (t.canWriteRef);

    return t;
  }

  private getJSObjectList(customObj: any){
    let json = Object.assign({}, customObj);

    json.ownerRef = this.af.collection('accountInfo').doc(json.owner.id).ref;
    json.canRead.forEach((ai) => {
      json.canReadRef.push(this.af.collection('accountInfo').doc(ai.id).ref);
    });
    json.canWrite.forEach((ai) => {
      json.canWriteRef.push(this.af.collection('accountInfo').doc(ai.id).ref);
    });

    delete (json.owner);
    delete (json.canRead);
    delete (json.canWrite);
    return json;
  }
}
