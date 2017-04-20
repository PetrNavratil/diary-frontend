import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { trackingActions } from '../reducers/tracking.reducer';
import { createOptions } from '../shared/createOptions';
import { environment } from '../../environments/environment.prod';
import { Action } from '@ngrx/store';
import { ToastrService } from '../shared/toastr.service';
const API_ENDPOINT = '/tracking';
const TRACKING = 'Trackování';
@Injectable()
export class TrackingEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {

  }

  @Effect() getTracking: Observable<Action> = this.actions
    .ofType(trackingActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '/book/' + action.payload, createOptions())
      .map(body => ({type: trackingActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst trackování knihy. Kliknutím aktualizujete stránku.', TRACKING);
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() getLastTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_GET_LAST)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: trackingActions.ADDITIONAL.GET_LAST, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst poslední trackování. Kliknutím aktualizujete stránku.', TRACKING);
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() startTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_START)
    .switchMap((action) => this.http.put(`${environment.apiUrl}${API_ENDPOINT}/start/${action.payload.id}?getReadings=${action.payload.readings}`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Trackování knihy bylo úspěšně zahájeno.', TRACKING);
        return {
          type: trackingActions.ADDITIONAL.START,
          payload: {readings: action.payload.readings, body: body.json()}
        }
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se začít nové trackování. Kliknutím aktualizujete stránku.', TRACKING);
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() stopTracking: Observable<Action> = this.actions
    .ofType(trackingActions.ADDITIONAL.API_END)
    .switchMap((action) => this.http.put(`${environment.apiUrl}${API_ENDPOINT}/stop/${action.payload.id}?getReadings=${action.payload.readings}`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Trackování knihy bylo úspěšně ukončeno.', TRACKING);
        return {
          type: trackingActions.ADDITIONAL.END,
          payload: {readings: action.payload.readings, body: body.json()}
        }
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst ukončit trackování. Kliknutím aktualizujete stránku.', TRACKING);
        return Observable.of({type: trackingActions.API_GET_FAIL, payload: body.json()})
      }));
}