import {Injectable} from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {List} from '../models/list';
import {Todo} from '../models/todo';

@Injectable({
    providedIn: 'root'
})
export class TodoService {
    private todos: Todo[] = [];
    currentListId = 0;

    constructor(private af: AngularFirestore) {}

    create(todo: Todo, listId: string): Promise<any> {
        let afList = this.af.doc('lists/' + listId);
        return afList.collection('todos').add(this.getJSObject(todo));
    }

    update(todo: Todo, listId: string): Promise<void> {
        let afList = this.af.doc('lists/' + listId);
        return afList.collection('todos').doc(todo.id).set(this.getJSObject(todo));
    }

    delete(todoId: string, listId: string): Promise<void> {
        return this.af.collection('lists').doc(listId).collection('todos').doc(todoId).delete();
    }

    // nextId(): number {
    //     this.currentListId++;
    //     return this.currentListId;
    // }

    getOneObs(todoId: string, listId: string): Observable<Todo> {
        return this.af.collection('lists').doc(listId).collection('todos').doc(todoId).snapshotChanges().pipe(
            map(actions => this.convertSingleSnapshotData<Todo>(actions))
        );
    }

    
    getListTodos(list: List): Observable<Todo[]>{
        return this.af.collection('lists').doc(list.id + '').collection('todos').snapshotChanges().pipe(
            map(actions => this.convertSnapshotData<Todo>(actions))
        );
    }

    private convertSnapshotData<T>(actions){
        return actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data} as T;
        });
    }
    private convertSingleSnapshotData<T>(actions) {
        const data = actions.payload.data();
        const id = actions.payload.id;
        return { id, ...data} as T;
    }

    private getJSObject(customObj: any){
        return Object.assign({}, customObj);
    }

}
