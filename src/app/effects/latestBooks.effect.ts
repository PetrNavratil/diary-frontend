import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { latestBooksActions } from '../reducers/latestBooks.reducer';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/books/latest';

@Injectable()
export class LatestBooksEffect {

  constructor(private actions: Actions, private http: Http) {

  }

  @Effect() getLatestBooks: Observable<Action> = this.actions
    .ofType(latestBooksActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}`, createOptions())
      .map(body => ({type: latestBooksActions.GET, payload: body.json()}))
      .catch(body => Observable.of({type: latestBooksActions.API_GET_FAIL, payload: body.json()})));
}