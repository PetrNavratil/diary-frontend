import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { authActions } from '../reducers/auth.reducer';
import { createOptions } from '../shared/createOptions';
import { userActions } from '../reducers/user.reducer';

const LOGIN_ENDPOINT = '/login';
const REGISTER_ENDPOINT = '/register';
const USER_ENDPOINT = '/user';


@Injectable()
export class AuthEffect {

  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() login: Observable<Action> = this.actions
    .ofType((<any>authActions.ADDITIONAL).LOGIN)
    .switchMap((action) => this.http.post(environment.apiUrl + LOGIN_ENDPOINT, action.payload.body)
      .flatMap(res => {
        res = res.json();
        localStorage.setItem('id_token', (<any>res).token);
        return this.http.get(environment.apiUrl + USER_ENDPOINT, createOptions());
      })
      .map(body => ({
        type: userActions.GET,
        payload: {body: [body.json()], origin: action.payload.origin}
      }))
      .catch(body => Observable.of({
        type: authActions.API_GET_FAIL,
        payload: {origin: action.payload.origin, body: body.json().message}
      })));

  @Effect() register: Observable<Action> = this.actions
    .ofType((<any>authActions.ADDITIONAL).REGISTER)
    .switchMap((action) => this.http.post(environment.apiUrl + REGISTER_ENDPOINT, action.payload.body)
      .flatMap(res => {
        res = res.json();
        localStorage.setItem('id_token', (<any>res).token);
        return this.http.get(environment.apiUrl + USER_ENDPOINT, createOptions());
      })
      .map(body => ({
        type: userActions.GET,
        payload: {body: [body.json()], origin: action.payload.origin}
      }))
      .catch(body => Observable.of({
        type: authActions.API_GET_FAIL,
        payload: {origin: action.payload.origin, body: body.json().message}
      })));
}