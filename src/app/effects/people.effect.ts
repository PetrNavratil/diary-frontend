import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { ToastrService } from '../shared/toastr.service';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { peopleActions } from '../reducers/people.reducer';
import { createOptions } from '../shared/createOptions';
import { environment } from '../../environments/environment';

const API_ENDPOINT = '/people';

@Injectable()
export class PeopleEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {
  }

  @Effect() getPeople: Observable<Action> = this.actions
    .ofType(peopleActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}?key=${action.payload}`, createOptions())
      .map(body => ({type: peopleActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se vyhledat přátelé. Kliknutím aktualizujete stránku.', 'Přátelé');
        return Observable.of({type: peopleActions.API_GET_FAIL, payload: body.json()})
      }));
}