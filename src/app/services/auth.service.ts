import { Injectable } from '@angular/core';

import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';


@Injectable()
export class AuthService {

  user: Observable<firebase.User>;
  public userDetails: firebase.User = null;

  get isAuthenticated():boolean {
    return this.userDetails !== null;
  }

  constructor(private afAuth: AngularFireAuth, private router:Router) {
    this.user = afAuth.authState;
    this.user.subscribe(user => this.userDetails = user ? user : null);
  }
  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider()
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.router.navigate(['/'])
      })
  }

  signOut() {
    this.afAuth.auth.signOut().then(() => {
     this.router.navigate(['/'])
    });
  }
}