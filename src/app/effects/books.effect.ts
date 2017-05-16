import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { booksActions } from '../reducers/books.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';
import { LanguageService } from '../shared/language.service';
const API_ENDPOINT = '/books';

@Injectable()
export class BookEffect {
  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  /**
   * Gets all users books
   */
  @Effect() getBooks: Observable<Action> = this.actions
    .ofType(booksActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: booksActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.books.getBooksFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return Observable.of({type: booksActions.API_GET_FAIL, payload: body.json()})
      }));
  /**
   * Gets information about one specific book
   */
  @Effect() getBook: Observable<Action> = this.actions
    .ofType(booksActions.ADDITIONAL.GET_SINGLE)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '/' + action.payload, createOptions())
      .map(body => ({type: booksActions.GET, payload: [body.json()]}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.books.getBookFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return Observable.of({type: booksActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Adds book to the user's books
   */
  @Effect() insertBook: Observable<Action> = this.actions
    .ofType(booksActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/' + action.payload, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.books.insertSuc')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return {type: booksActions.GET, payload: [body.json()]}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.books.insertFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return Observable.of({type: booksActions.API_CREATE_FAIL, payload: body.json()})
      }));

  /**
   * Removes book from the user's books
   */
  @Effect() removeBook: Observable<Action> = this.actions
    .ofType(booksActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.books.removeSuc')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return {type: booksActions.GET, payload: [body.json()]}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.books.removeFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return Observable.of({type: booksActions.API_DELETE_FAIL, payload: body.json()})
      }));

  /**
   * Updates user's book - status, educational
   */
  @Effect() updateBook: Observable<Action> = this.actions
    .ofType(booksActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.books.statusSuc')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return {type: booksActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.books.statusFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.books.title')}`
        );
        return Observable.of({type: booksActions.API_UPDATE_FAIL, payload: body.json()})
      }));
}