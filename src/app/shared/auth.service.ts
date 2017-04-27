import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { ToastrService } from './toastr.service';
import { ReplaySubject } from 'rxjs';

declare const require: any;
const auth0 = require('auth0-js');

@Injectable()
export class AuthService {
  // Configure Auth0
  auth0 = new auth0.WebAuth({
    domain: 'petrn.eu.auth0.com',
    clientID: 'IEIH7LLFi8KDXMNQAGvTY0lbE0tGjJI3',
    // specify your desired callback URL
    redirectUri: 'http://www.stud.fit.vutbr.cz/~xnavra53/diary/',
    // redirectUri: 'http://localhost:4200',
    responseType: 'token id_token'
  });

  errorMessage: ReplaySubject<string> = new ReplaySubject<string>();
  errorMessage$ = this.errorMessage.asObservable();


  constructor(private toastr: ToastrService) {
  }

  public handleAuthentication(): void {
    this.auth0.parseHash({_idTokenVerification: false}, (err, authResult) => {
      if (err) {
        console.error(`Error: ${err.errorDescription}`);
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
      }
    });
  }

  public login(username: string, password: string): void {
    console.log('username', username, password);
    this.auth0.redirect.loginWithCredentials({
      connection: 'Username-Password-Authentication',
      username,
      password
    }, err => {
      if (err) {
        this.errorMessage.next(err.description);
        return console.error(err.description);
      }
    });
  }

  public signup(email, password, username): void {
    console.log('asdasdas', this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
      username
    }, err => {
      if (err) {
        this.errorMessage.next(err.description);
        console.error(err.description);
        return err.description;
      }
    }));
  }

  public loginWithGoogle(): void {
    this.auth0.authorize({
      connection: 'google-oauth2',
    });
  }

  public loginWithFacebook(): void {
    this.auth0.authorize({
      connection: 'facebook',
    });
  }

  public isValid(): boolean {
    // Check whether the id_token is expired or not
    if (localStorage.getItem('id_token')) {
      return !tokenNotExpired();
    } else {
      return false;
    }
  }

  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    location.reload();
  }

  changePassword(email: string) {
    console.log('email', email);
    this.auth0.changePassword({
      email: email,
      connection: 'Username-Password-Authentication'
    }, (err, resp) => {
      if(err){
        this.toastr.showError('Email se nepodařilo odeslat. Zkuste akci opakovat.', 'Změna hesla', true);
      }else{
        this.toastr.showSuccess('Email byl úspěšně odeslán.', 'Změna hesla', true);
      }
    });
  }

}