import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { shelvesActions }from '../reducers/shelves.reducer';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/shelves';

@Injectable()
export class ShelvesEffect {

  constructor(private actions: Actions, private http: Http) {

  }

  @Effect() getShelves: Observable<Action> = this.actions
    .ofType(shelvesActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: shelvesActions.GET, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_GET_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() addShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload.body, createOptions())
      .map(body => ({type: shelvesActions.CREATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_CREATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() addBookToShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_ADD_BOOK)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, action.payload.body.book, createOptions())
      .map(body => ({type: shelvesActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() removeBookFromShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_REMOVE_BOOK)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id + '/' + action.payload.body.book.id, createOptions())
      .map(body => ({type: shelvesActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() removeShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, createOptions())
      .map(body => ({type: shelvesActions.DELETE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_DELETE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));

  @Effect() updateShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.body.id, action.payload.body, createOptions())
      .map(body => ({type: shelvesActions.UPDATE, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));
}