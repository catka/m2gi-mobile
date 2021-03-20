import { AccountInfo } from './../models/accountInfo';
import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { distinct, map, tap, flatMap, mergeMap, delay } from 'rxjs/operators';
import {AuthService} from './auth.service';
import firebase from 'firebase';
import User = firebase.User;
import { combineLatest } from 'rxjs';
import { from } from 'rxjs';

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


  getAll(): Observable<any> {
    return combineLatest([this.owningCollection.snapshotChanges(), this.readSharedCollection.snapshotChanges(), this.writeSharedCollection.snapshotChanges()]).pipe(
      map(arr => arr.reduce((acc, cur) => acc.concat(cur))),
      flatMap(actions => from(this.convertSnapshotData<List>(actions))),
      tap((res) => console.log("retrieved lists:", res)),
      map((lists) => lists.filter((l, index, self) => index === self.findIndex((findL) => findL.id === l.id))), // removes list duplicates
    );
  }

  getOneObs(id: string): Observable<List>{
    return this.owningCollection?.doc(id + '').snapshotChanges().pipe(
      flatMap(actions => this.convertSingleSnapshotData<List>(actions))
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

  private async convertSnapshotData<T>(actions) {
    for (let i = 0; i < actions.length; i++){
      const data = actions[i].payload.doc.data();
      const id = actions[i].payload.doc.id;
      let t = { id, ...data } as T;
      actions[i] = await this.convertRefs(t);
    }
    
    return actions;
  }
  private async convertSingleSnapshotData<T>(actions){
    const data = actions.payload.data();
    const id = actions.payload.id;
    let t = { id, ...data } as T;

    t = await this.convertRefs(t);
    
    return t;
  }

  private async convertRefs(t: any) {
    if (t.ownerRef) {
      await t.ownerRef.get().then((res) => {
        t.owner = res.data();
      });
      t.ownerRef = null;
    }
    
    if (t.canReadRef) {
      t.canRead = [];
      for (let i = 0; i < t.canReadRef.length; i++){
        await t.canReadRef[i].get().then((res) => {
          t.canRead.push(res.data());
        });
      }
    }
    if (t.canWriteRef) {
      t.canWrite = [];
      for (let i = 0; i < t.canWriteRef.length; i++){
        await t.canWriteRef[i].get().then((res) => {
          t.canWrite.push(res.data());
        });
      }
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
