import { AccountInfo } from 'src/app/models/accountInfo';
import { Observable } from 'rxjs';
import { Todo } from './todo';
import { DocumentReference } from '@angular/fire/firestore';

export class List {
  id: string;
  name: string;
  ownerRef: DocumentReference<AccountInfo>;
  canReadRef: DocumentReference<AccountInfo>[] = [];
  canWriteRef: DocumentReference<AccountInfo>[] = [];
  owner: AccountInfo;
  canRead: AccountInfo[] = [];
  canWrite: AccountInfo[] = [];
  todos: Todo[] = [];

  constructor(name: string, owner?: AccountInfo, canRead?: AccountInfo[], canWrite?: AccountInfo[]) {
    this.name = name;
    this.owner = owner;
    this.canRead = canRead;
    this.canWrite = canWrite;
  }

  get stats(): string {
    return this.todos.length + ' todos';
  }
}
