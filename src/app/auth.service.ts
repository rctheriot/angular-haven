import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {

  token: string;

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  signinUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password).then(response => {
      firebase.auth().currentUser.getIdToken().then((token: string) => {
        this.token = token;
        if (this.token) {
          this.router.navigate(['/main/home']);
        }
      });
    }, error => alert(error.message)).catch(error => alert(error));
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.token = null;
    this.router.navigate(['/login'])
  }

  getId() {
    return this.afAuth.auth.currentUser.uid;
  }

  isAuthenticated() {
    return this.token != null;
  }

  createAccount(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(user => {
      if (user !== null) {
        this.signinUser(email, password);
      }
    }, error => alert(error.message)).catch(error => alert(error));
  }
}
