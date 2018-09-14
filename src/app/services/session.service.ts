import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';
import {
  AngularFirestore,
  AngularFirestoreCollection, AngularFirestoreDocument
} from "angularfire2/firestore";
import * as admin from "firebase/app";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessions : Observable<any[]>
  private sesssionRef: AngularFirestoreCollection<any>;
  
  constructor(public af: AngularFirestore) {
    this.sesssionRef = af.collection('sessions', ref => ref.orderBy('sessionDate', 'desc').limit(100))
    this.sessions = this.sesssionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
}