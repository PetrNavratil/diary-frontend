import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { readingsActions } from '../reducers/reading.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';

const API_ENDPOINT = '/readings';

@Injectable()
export class ReadingEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {
  }

  @Effect() getReadings: Observable<Action> = this.actions
    .ofType(readingsActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: readingsActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst informace o čtení knihy. Kliknutím aktualizujete stránku.', 'Čtení');
        return Observable.of({type: readingsActions.API_GET_FAIL, payload: body.json()})
      }));
}