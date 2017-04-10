import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { booksActions } from '../reducers/books.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
/**
 * Created by petr on 6.3.17.
 */
const API_ENDPOINT = '/books';


@Injectable()
export class BookEffect {

  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() getBooks: Observable<Action> = this.actions
    .ofType(booksActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: booksActions.GET, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: booksActions.API_GET_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() getBook: Observable<Action> = this.actions
    .ofType(booksActions.ADDITIONAL.GET_SINGLE)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body, createOptions())
      .map(body => ({type: booksActions.GET, payload: {origin: action.payload.origin, body: [body.json()]}}))
      .catch(body => Observable.of({type: booksActions.API_GET_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() insertBook: Observable<Action> = this.actions
    .ofType(booksActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/'+ action.payload.body, {}, createOptions())
      .map(body => ({type: booksActions.GET, payload: {origin: action.payload.origin, body: [body.json()]}}))
      .catch(body => Observable.of({type: booksActions.API_CREATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() removeBook: Observable<Action> = this.actions
    .ofType(booksActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/'+ action.payload.body, createOptions())
      .map(body => ({type: booksActions.GET, payload: {origin: action.payload.origin, body: [body.json()]}}))
      .catch(body => Observable.of({type: booksActions.API_DELETE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() updateBook: Observable<Action> = this.actions
    .ofType(booksActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, action.payload.body, createOptions())
      .map(body => ({type: booksActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: booksActions.API_UPDATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));
}