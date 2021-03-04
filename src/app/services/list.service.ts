import { List } from './../models/list';
import { Injectable } from '@angular/core';
import { Todo } from '../models/todo';
import {TodoService} from './todo.service';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private lists: List[] = [];
  currentListId = 0;

  private listCollection: AngularFirestoreCollection<List>;

  constructor(private todoService: TodoService, private af: AngularFirestore) {
    // this.listCollection = this.af.collection('lists', ref => {
    //   return ref
    //       // .where('canRead', 'array-contains', 'AzzaujI8wCcnXJujpOBrhVKLYOP2');
    //       .where('owner', '==', 'AzzaujI8wCcnXJujpOBrhVKLYOP2'])
    //   ;
    // });
    this.listCollection = this.af.collection('lists');
  }

  getAll(): Observable<List[]> {
    return this.listCollection.snapshotChanges().pipe(
        map(actions => this.convertSnapshotData<List>(actions))
    );
  }

  getOne(id: string): List{
    return this.lists.find((l) => l.id === id);
  }

  getOneObs(id: string): Observable<List>{
    return this.listCollection.doc(id + '').snapshotChanges().pipe(
        map(actions => this.convertSingleSnapshotData<List>(actions))
    );
  }

  create(list: List): Promise<void>{
    return this.listCollection.doc().set(this.getJSObject(list));
  }

  update(list: List, value): Promise<void>{
    return this.listCollection.doc(list.id + '').set(value);
  }

  delete(list: List): Promise<void>{
    return this.listCollection.doc(list.id + '').delete();
  }

  nextId(): number{
    this.currentListId++;
    return this.currentListId;
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
