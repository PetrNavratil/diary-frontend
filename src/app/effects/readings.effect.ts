import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { readingsActions } from '../reducers/reading.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/readings';

@Injectable()
export class ReadingEffect {

  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() getReadings: Observable<Action> = this.actions
    .ofType(readingsActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: readingsActions.GET, payload: {origin: action.payload.origin, body: body.json()}}))
      .catch(body => Observable.of({type: readingsActions.API_GET_FAIL, payload: {origin: action.payload.origin, body: body.json()}})));
}