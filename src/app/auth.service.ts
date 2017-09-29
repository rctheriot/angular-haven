import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthService {
  token: string;

  constructor(private router: Router, private afAuth: AngularFireAuth) { }

  signinUser(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(
      response => {
        firebase.auth().currentUser.getIdToken()
          .then(
          (token: string) => {
            this.token = token;
            if (this.token) {
              this.router.navigate(['/main/home']);
            }
          }
          )

      }
      )
      .catch(
      error => alert(error)
      );
  }

  signOut(): void {
    this.afAuth.auth.signOut();
    this.token = null;
    this.router.navigate(['/login'])
  }

  getToken() {
    this.afAuth.auth.currentUser.getIdToken()
      .then(
      (token: string) => this.token = token
      );
    return this.token;
  }

  getId() {
    return this.afAuth.auth.currentUser.uid;
  }

  isAuthenticated() {
    return this.token != null;
  }

  createAccount(email, password) {
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(function (user) {
      if (user !== null) {
        alert('Account Created Successfully');
      }
    }, function (error) {
      // Handle Errors here.
      alert(error.message);
    });
  }
}
