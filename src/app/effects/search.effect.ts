import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { searchActions } from '../reducers/search.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';
import { LanguageService } from '../shared/language.service';

const API_ENDPOINT = '/search?key=';


@Injectable()
export class SearchEffect {

  constructor(private actions: Actions,
              private http: Http,
              private language: LanguageService,
              private toastr: ToastrService) {
  }

  @Effect() search: Observable<Action> = this.actions
    .ofType(searchActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + encodeURI(action.payload), createOptions())
      .map(body => ({type: searchActions.GET, payload: body.json()}))
      .catch(body =>{
        this.toastr.showError(
          `${this.language.instantTranslate('toasts.search.searchFail')}`,
          `${this.language.instantTranslate('toasts.search.title')}`
        );
        return Observable.of({type: searchActions.API_GET_FAIL, payload: body.json()})
      }));
}