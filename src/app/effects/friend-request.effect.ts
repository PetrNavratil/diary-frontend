import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { ToastrService } from '../shared/toastr.service';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';
import { requestActions } from '../reducers/friend-request.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { AppState } from '../models/store-model';
import { friendsActions } from '../reducers/friends.reducer';
import { LanguageService } from '../shared/language.service';

const API_ENDPOINT = '/friends/requests';
const ACCEPT = 'accept';
const DECLINE = 'decline';

@Injectable()
export class RequestEffect {

  constructor(private actions: Actions,
              private http: Http,
              private toastr: ToastrService,
              private language: LanguageService,
              private store: Store<AppState>) {

  }

  @Effect() getRequests: Observable<Action> = this.actions
    .ofType(requestActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}`, createOptions())
      .map(body => ({type: requestActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.requests.getFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return Observable.of({type: requestActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() addRequest: Observable<Action> = this.actions
    .ofType(requestActions.API_CREATE)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.requests.addSuc')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return {type: requestActions.CREATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.requests.addFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return Observable.of({type: requestActions.API_CREATE_FAIL, payload: body.json()})
      }));

  @Effect() declineRequest: Observable<Action> = this.actions
    .ofType(requestActions.ADDITIONAL.DECLINE)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/${DECLINE}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.requests.declineSuc')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return {type: requestActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.requests.declineFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() acceptRequest: Observable<Action> = this.actions
    .ofType(requestActions.ADDITIONAL.ACCEPT)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/${ACCEPT}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.requests.acceptSuc')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        this.store.dispatch({type: friendsActions.API_GET});
        return {type: requestActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.requests.acceptFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() removeRequest: Observable<Action> = this.actions
    .ofType(requestActions.API_DELETE)
    .switchMap((action) => this.http.delete(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}`, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.requests.removeSuc')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return {type: requestActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.requests.removeFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.requests.title')}`
        );
        return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
      }));

}