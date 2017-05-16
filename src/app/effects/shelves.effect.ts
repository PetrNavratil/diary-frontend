import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { shelvesActions }from '../reducers/shelves.reducer';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';
import { LanguageService } from '../shared/language.service';

const API_ENDPOINT = '/shelves';

@Injectable()
export class ShelvesEffect {

  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  /**
   * Gets user's shelves
   */
  @Effect() getShelves: Observable<Action> = this.actions
    .ofType(shelvesActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: shelvesActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.getShelvesFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Adds shelf
   */
  @Effect() addShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.addShelfSuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.CREATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.addShelfFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_CREATE_FAIL, payload: body.json()})
      }));

  /**
   * Adds book to the shelf
   */
  @Effect() addBookToShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_ADD_BOOK)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload.book, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.addBookSuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.addBookFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  /**
   * Removes book from shelf
   */
  @Effect() removeBookFromShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_REMOVE_BOOK)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id + '/' + action.payload.book.id, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.removeBookSuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.removeBookFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  /**
   * Removes shelf
   */
  @Effect() removeShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.removeShelfSuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.removeShelfFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_DELETE_FAIL, payload: body.json()})
      }));

  /**
   * Renames shelf
   */
  @Effect() updateShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.editShelfSuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.editShelfFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  /**
   * Copies shelf
   */
  @Effect() copyShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_COPY)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/copy`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.shelves.copySuc')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return {type: shelvesActions.ADDITIONAL.COPY}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.shelves.copyFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.shelves.title')}`
        );
        return Observable.of({type: shelvesActions.ADDITIONAL.COPY})
      }));
}