import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { searchActions } from '../reducers/search.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/search?key=';


@Injectable()
export class SearchEffect {

  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() search: Observable<Action> = this.actions
    .ofType(searchActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + encodeURI(action.payload.body), createOptions())
      .map(body => ({type: searchActions.GET, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: searchActions.API_GET_FAIL, payload: {origin: action.payload.origin, body}})));
}