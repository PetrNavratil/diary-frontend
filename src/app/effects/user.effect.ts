import { Injectable } from '@angular/core';
import { userActions } from '../reducers/user.reducer';
import { Effect, Actions } from '@ngrx/effects';
import { Http } from '@angular/http';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { Observable } from 'rxjs';

const USER_ENDPOINT = '/user';

@Injectable()
export class UserEffect {
  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() getUser = this.actions.ofType(userActions.API_GET)
    .switchMap(action => this.http.get(environment.apiUrl + USER_ENDPOINT, createOptions())
      .map(body => ({type: userActions.GET, payload: {origin: action.payload.origin, body: [body.json()]}}))
      .catch(body => Observable.of({
        type: userActions.API_GET_FAIL,
        payload: {origin: action.payload.origin, body: body.json().message}
      })));

  @Effect() editUser = this.actions.ofType(userActions.API_UPDATE)
    .switchMap(action => this.http.put(`${environment.apiUrl}${USER_ENDPOINT}/${action.payload.body.id}`, action.payload.body, createOptions())
      .map(body => ({type: userActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({
        type: userActions.API_UPDATE_FAIL,
        payload: {origin: action.payload.origin, body: body.json().message}
      })));

  @Effect() uploadAvatar = this.actions.ofType(userActions.ADDITIONAL.UPLOAD_AVATAR)
    .switchMap(action => {
      let formData: FormData = new FormData();
      formData.append('file', action.payload.body, action.payload.body.name);
      let options = createOptions();
      options.headers.append('enctype', 'multipart/form-data');
      return this.http.post(`${environment.apiUrl}${USER_ENDPOINT}/avatar`, formData, options)
        .map(body => ({type: userActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
        .catch(body => Observable.of({
          type: userActions.API_CREATE_FAIL,
          payload: {origin: action.payload.origin, body: body.json().message}
        }))
    });

}