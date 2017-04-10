import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { commentActions } from '../reducers/comments.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/comments';

@Injectable()
export class CommentsEffect {

  constructor(private actions: Actions, private http: Http) {

  }

  @Effect() getComments: Observable<Action> = this.actions
    .ofType(commentActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '?bookId=' + action.payload.body, createOptions())
      .map(body => ({type: commentActions.GET, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: commentActions.API_GET_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() addComment: Observable<Action> = this.actions
    .ofType(commentActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload.body, createOptions())
      .map(body => ({type: commentActions.CREATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: commentActions.API_CREATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() removeComment: Observable<Action> = this.actions
    .ofType(commentActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, createOptions())
      .map(body => ({type: commentActions.DELETE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: commentActions.API_DELETE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() updateComment: Observable<Action> = this.actions
    .ofType(commentActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, action.payload.body, createOptions())
      .map(body => ({type: commentActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: commentActions.API_UPDATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));
}