import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';

declare const require: any;
const auth0 = require('auth0-js');

@Injectable()
export class AuthService {
  // Configure Auth0
  auth0 = new auth0.WebAuth({
    domain: 'petrn.eu.auth0.com',
    clientID: 'IEIH7LLFi8KDXMNQAGvTY0lbE0tGjJI3',
    // specify your desired callback URL
    redirectUri: 'http://localhost:4200',
    responseType: 'token id_token'
  });


  constructor() {}

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
    this.auth0.redirect.loginWithCredentials({
      connection: 'Username-Password-Authentication',
      username,
      password
    }, err => {
      if (err) {
        return console.error(err.description);
      }
    });
  }

  public signup(email, password): void {
    this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
    }, err => {
      if (err) {
        return console.error(err.description);
      }
    });
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

  public isAuthenticated(): boolean {
    // Check whether the id_token is expired or not
    return tokenNotExpired();
  }

  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }

}