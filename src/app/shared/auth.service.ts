import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { ToastrService } from './toastr.service';
import { ReplaySubject } from 'rxjs';
import { LanguageService } from './language.service';

declare const require: any;
const auth0 = require('auth0-js');

@Injectable()
export class AuthService {
  // Configure Auth0
  auth0 = new auth0.WebAuth({
    domain: 'petrn.eu.auth0.com',
    clientID: 'IEIH7LLFi8KDXMNQAGvTY0lbE0tGjJI3',
    // specify your desired callback URL
    // redirectUri: 'http://www.stud.fit.vutbr.cz/~xnavra53/diary/',
    redirectUri: 'http://localhost:4200',
    responseType: 'token id_token'
  });

  /**
   * Replay subject for error messages from auth0
   * @type {ReplaySubject<string>}
   */
  errorMessage: ReplaySubject<string> = new ReplaySubject<string>();
  /**
   * Observable for error messages from auth0
   * @type {Observable<string>}
   */
  errorMessage$ = this.errorMessage.asObservable();


  constructor(private toastr: ToastrService,
              private language: LanguageService) {
  }

  /**
   * Sets auth0 object to handle authentication
   */
  public handleAuthentication(): void {
    this.auth0.parseHash({_idTokenVerification: false}, (err, authResult) => {
      if (err) {
        console.error(`Error: ${err.errorDescription}`);
      }
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        // save tokens
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
      }
    });
  }

  /**
   * Logs in user by provided username and password
   * @param username
   * @param password
   */
  public login(username: string, password: string): void {
    this.auth0.redirect.loginWithCredentials({
      connection: 'Username-Password-Authentication',
      username,
      password
    }, err => {
      if (err) {
        // pass error message to the subject
        this.errorMessage.next(err.description);
        return console.error(err.description);
      }
    });
  }

  /**
   * Signs up user by provided email, password and username
   * @param email
   * @param password
   * @param username
   */
  public signup(email, password, username): void {
    this.auth0.redirect.signupAndLogin({
      connection: 'Username-Password-Authentication',
      email,
      password,
      username
    }, err => {
      if (err) {
        // pass error message to the subject
        this.errorMessage.next(err.description);
        console.error(err.description);
        return err.description;
      }
    });
  }

  /**
   * Logs in with Google account
   */
  public loginWithGoogle(): void {
    this.auth0.authorize({
      connection: 'google-oauth2',
    });
  }

  /**
   * Logs in with Facebook account
   */
  public loginWithFacebook(): void {
    this.auth0.authorize({
      connection: 'facebook',
    });
  }

  /**
   * Checks whether token is valid
   * @returns {boolean}
   */
  public isValid(): boolean {
    // Check whether the id_token is expired or not
    if (localStorage.getItem('id_token')) {
      return !tokenNotExpired();
    } else {
      return false;
    }
  }

  /**
   * Logs out user and refreshes page
   */
  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    location.reload();
  }

  /**
   * Sends email with change password link to the user's email address
   * @param email
   */
  changePassword(email: string) {
    this.auth0.changePassword({
      email: email,
      connection: 'Username-Password-Authentication'
    }, (err, resp) => {
      if (err) {
        this.toastr.showError(
          `${this.language.instantTranslate('landing.errors.emailNotSent')}`,
          `${this.language.instantTranslate('shared.password')}`,
          true);
      } else {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('landing.errors.emailSent')}`,
          `${this.language.instantTranslate('shared.password')}`,
          true);
      }
    });
  }
}