import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { detailActions } from '../reducers/book-detail.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/book-detail/';


@Injectable()
export class BookDetail {
  constructor(private actions: Actions, private http: Http) {
  }

  @Effect() bookDetail: Observable<Action> = this.actions
    .ofType(detailActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + encodeURI(action.payload), createOptions())
      .map(body => ({type: detailActions.GET, payload: [body.json()]}))
      .catch(body => Observable.of({type: detailActions.API_GET_FAIL, payload: body})));
}
