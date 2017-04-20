import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { booksActions } from '../reducers/books.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';
const API_ENDPOINT = '/books';
const BOOK = 'Kniha';

@Injectable()
export class BookEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {
  }

  @Effect() getBooks: Observable<Action> = this.actions
    .ofType(booksActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: booksActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst vaše knihy. Kliknutím aktualizujete stránku.', BOOK);
        return Observable.of({type: booksActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() getBook: Observable<Action> = this.actions
    .ofType(booksActions.ADDITIONAL.GET_SINGLE)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '/' + action.payload, createOptions())
      .map(body => ({type: booksActions.GET, payload: [body.json()]}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst knihu. Kliknutím aktualizujete stránku.', BOOK);
        return Observable.of({type: booksActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() insertBook: Observable<Action> = this.actions
    .ofType(booksActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/' + action.payload, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Kniha byla úspěšně přidána mezi vaše knihy.', BOOK);
        return {type: booksActions.GET, payload: [body.json()]}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se přidat knihu mezi vaše knihy. Kliknutím aktualizujete stránku.', BOOK);
        return Observable.of({type: booksActions.API_CREATE_FAIL, payload: body.json()})
      }));

  @Effect() removeBook: Observable<Action> = this.actions
    .ofType(booksActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Kniha byla úspěšně odebrána z vašich knih.', BOOK);
        return {type: booksActions.GET, payload: [body.json()]}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se odebrat knihu z vašich knih. Kliknutím aktualizujete stránku.', BOOK);
        return Observable.of({type: booksActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() updateBook: Observable<Action> = this.actions
    .ofType(booksActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Stav knihy byl úspěšně aktualizován.', BOOK);
        return {type: booksActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se aktualizovat stav knihy. Kliknutím aktualizujete stránku.', BOOK);
        return Observable.of({type: booksActions.API_UPDATE_FAIL, payload: body.json()})
      }));
}