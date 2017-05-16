import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { trackingActions } from '../reducers/tracking.reducer';
import { createOptions } from '../shared/createOptions';
import { environment } from '../../environments/environment.prod';
import { Action } from '@ngrx/store';
import { ToastrService } from '../shared/toastr.service';
import { LanguageService } from '../shared/language.service';

const API_ENDPOINT = '/tracking';

@Injectable()
export class TrackingEffect {

  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  /**
   * Gets tracking
   */
  @Effect() getTracking: Observable<Action> = this.actions
    .ofType(trackingActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '/book/' + action.payload, createOptions())
      .map(body => ({type: trackingActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.trackings.getTrackingFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Gets last tracking
   */
  @Effect() getLastTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_GET_LAST)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: trackingActions.ADDITIONAL.GET_LAST, payload: body.json()}))
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.trackings.getLastFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Starts book tracking
   */
  @Effect() startTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_START)
    .switchMap((action) => this.http.put(`${environment.apiUrl}${API_ENDPOINT}/start/${action.payload.id}?getReadings=${action.payload.readings}`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.trackings.startSuc')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return {
          type: trackingActions.ADDITIONAL.START,
          payload: {readings: action.payload.readings, body: body.json()}
        }
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.trackings.startFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  /**
   * Stopts book tracking
   */
  @Effect() stopTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_END)
    .switchMap((action) => this.http.put(`${environment.apiUrl}${API_ENDPOINT}/stop/${action.payload.id}?getReadings=${action.payload.readings}`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess(
          `${this.language.instantTranslate('toasts.trackings.stopSuc')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return {
          type: trackingActions.ADDITIONAL.END,
          payload: {readings: action.payload.readings, body: body.json()}
        }
      })
      .catch(body => {
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.trackings.stopFail')}${this.language.instantTranslate('toasts.refresh')}`,
          `${this.language.instantTranslate('toasts.trackings.title')}`
        );
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));
}