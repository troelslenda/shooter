import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreCollection, AngularFirestoreDocument
} from "angularfire2/firestore";
import * as firebase from "firebase/app";
import { QueryDocumentSnapshot } from '@google-cloud/firestore';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessions : Observable<any[]>
  latestSession : Observable<any[]>

  private sesssionRef: AngularFirestoreCollection<any>;
  
  constructor(public af: AngularFirestore) {
    this.sesssionRef = af.collection('sessions', ref => ref.orderBy('date', 'desc').limit(100))
    this.sessions = this.sesssionRef.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }
  
  public async saveRoundToNewSession(round, user: firebase.User) {
    const sessionDocument = await this.newSession(user)
    return sessionDocument.collection('round').add(round)  
  }

  public async saveRoundToPreviousSession(round, user) {
    const previousSessionDocument =  this.loadLatestSession(user)
    previousSessionDocument.subscribe(query => {
      this.af.collection(`sessions/${query.docs[0].id}/round`).add(round)
    })
  }

  public  loadLatestSession(user: firebase.User) {
    const ref = this.af
      .collection('sessions', ref=> 
        ref.where('uid', '==', user.uid).orderBy('date', 'desc').limit(1))
    return ref.get()
    
  }

  private async newSession(user: firebase.User) {
    const ref: AngularFirestoreCollection<any> = await this.af.collection('sessions')
    console.log('user', user)
    const data = {
      name: user.displayName,
      date: new Date(),
      uid: user.uid
    }
    return await ref.add(data)
  }

  private saveRound(session, round) {
    const ref: AngularFirestoreCollection<any> = this.af.collection(`sessions/${session.id}/round`);
    return ref.add(round);
  }
}