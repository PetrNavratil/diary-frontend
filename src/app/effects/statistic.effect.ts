import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { statisticActions} from '../reducers/statistic.reducer';
import { createOptions } from '../shared/createOptions';
import { environment } from '../../environments/environment.prod';
import { ToastrService } from '../shared/toastr.service';

const API_ENDPOINT = '/statistic';

@Injectable()
export class StatisticEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {
  }

  @Effect() getStatistic: Observable<Action> = this.actions
    .ofType(statisticActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: statisticActions.GET, payload: [body.json()]}))
      .catch(body =>{
        this.toastr.showError('Nepodařilo se načíst uživatelské statistiky. Kliknutím aktualizujete stránku.', 'Statistiky');
        return Observable.of({type: statisticActions.API_GET_FAIL, payload: body.json()})
      }));
}