import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { commentActions } from '../reducers/comments.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';
import { LanguageService } from '../shared/language.service';

const API_ENDPOINT = '/comments';

@Injectable()
export class CommentsEffect {

  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  /**
   * Gets all book's comments
   */
  @Effect() getComments: Observable<Action> = this.actions
    .ofType(commentActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '?bookId=' + action.payload, createOptions())
      .map(body => ({type: commentActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.comments.getFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return Observable.of({type: commentActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Adds book comment
   */
  @Effect() addComment: Observable<Action> = this.actions
    .ofType(commentActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.comments.insertSuc')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return {type: commentActions.CREATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.comments.insertFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return Observable.of({type: commentActions.API_CREATE_FAIL, payload: body.json()})
      }));

  /**
   * Removes book comment
   */
  @Effect() removeComment: Observable<Action> = this.actions
    .ofType(commentActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.comments.removeSuc')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return {type: commentActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.comments.removeFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return Observable.of({type: commentActions.API_DELETE_FAIL, payload: body.json()})
      }));

  /**
   * Updates book comment
   */
  @Effect() updateComment: Observable<Action> = this.actions
    .ofType(commentActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.comments.editSuc')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return {type: commentActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.comments.editFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.comments.title')}`
        );
        return Observable.of({type: commentActions.API_UPDATE_FAIL, payload: body.json()})
      }));
}