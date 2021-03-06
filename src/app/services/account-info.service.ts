import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AccountInfo} from '../models/accountInfo';

@Injectable({
  providedIn: 'root'
})
export class AccountInfoService {
  private accountInfos: AccountInfo[] = [];
  private accountInfoCollection: AngularFirestoreCollection<AccountInfo>;

  constructor(private af: AngularFirestore) {
    this.accountInfoCollection = this.af.collection('accountInfo');
  }

  getAll(): Observable<AccountInfo[]> {
    return this.accountInfoCollection.snapshotChanges().pipe(
        map(actions => this.convertSnapshotData<AccountInfo>(actions))
    );
  }
  getOneObs(id: string): Observable<AccountInfo>{
    return this.accountInfoCollection.doc(id + '').snapshotChanges().pipe(
        map(actions => this.convertSingleSnapshotData<AccountInfo>(actions))
    );
  }

  create(accountInfo: AccountInfo, id: string): Promise<void>{
    // Account info id not automatically generated
    return this.accountInfoCollection.doc(id).set(this.getJSObject(accountInfo));
  }

  update(accountInfo: AccountInfo, value): Promise<void>{
    return this.accountInfoCollection.doc(accountInfo.id + '').set(value);
  }

  delete(accountInfo: AccountInfo): Promise<void>{
    return this.accountInfoCollection.doc(accountInfo.id + '').delete();
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
