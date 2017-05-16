import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { ToastrService } from '../shared/toastr.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { friendsActions } from '../reducers/friends.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { LanguageService } from '../shared/language.service';
const API_ENDPOINT = '/friends';

@Injectable()
export class FriendsEffect {

  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  /**
   * Gets user's friends
   */
  @Effect() getFriends: Observable<Action> = this.actions
    .ofType(friendsActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}`, createOptions())
      .map(body => ({type: friendsActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.friends.getFriendsFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.friends.title')}`
        );
        return Observable.of({type: friendsActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Gets specific friend
   */
  @Effect() getFriend: Observable<Action> = this.actions
    .ofType(friendsActions.ADDITIONAL.API_GET_SINGLE)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}`, createOptions())
      .map(body => ({type: friendsActions.GET, payload: [body.json()]}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.friends.getFriendFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.friends.title')}`
        );
        return Observable.of({type: friendsActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Removes friend
   */
  @Effect() deleteFriend: Observable<Action> = this.actions
    .ofType(friendsActions.API_DELETE)
    .switchMap((action) => this.http.delete(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}`, createOptions())
      .map(body => ({type: friendsActions.DELETE, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.friends.removeFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.friends.title')}`
        );
        return Observable.of({type: friendsActions.API_DELETE_FAIL, payload: body.json()})
      }));

}