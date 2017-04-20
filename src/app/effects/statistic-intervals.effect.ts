import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { intervalsActions } from '../reducers/statistic-intervals.reducer';
import { ToastrService } from '../shared/toastr.service';
const API_ENDPOINT = '/intervals';

@Injectable()
export class IntervalsEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {
  }

  @Effect() getStatisticIntervals: Observable<Action> = this.actions
    .ofType(intervalsActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}?month=${action.payload.month}&year=${action.payload.year}`, createOptions())
      .map(body => ({type: intervalsActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst intervaly pro dané období. Kliknutím aktualizujete stránku.', 'Intervaly');
        return Observable.of({type: intervalsActions.API_GET_FAIL, payload: body.json()})
      }));
}