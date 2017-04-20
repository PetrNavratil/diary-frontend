import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { commentActions } from '../reducers/comments.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';

const API_ENDPOINT = '/comments';
const COMMENTS = 'Komentáře';
@Injectable()
export class CommentsEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {

  }

  @Effect() getComments: Observable<Action> = this.actions
    .ofType(commentActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT + '?bookId=' + action.payload, createOptions())
      .map(body => ({type: commentActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se získat komentáře knihy. Kliknutím aktualizujete stránku.', COMMENTS);
        return Observable.of({type: commentActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() addComment: Observable<Action> = this.actions
    .ofType(commentActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Komentář byl úspěšně přidán.', COMMENTS);
        return {type: commentActions.CREATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se přidat nový komentář. Kliknutím aktualizujete stránku.', COMMENTS);
        return Observable.of({type: commentActions.API_CREATE_FAIL, payload: body.json()})
      }));

  @Effect() removeComment: Observable<Action> = this.actions
    .ofType(commentActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, createOptions())
      .map(body => {
        this.toastr.showSuccess('Komentář byl úspěšně odebrán.', COMMENTS);
        return {type: commentActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se smazat komentář. Kliknutím aktualizujete stránku.', COMMENTS);
        return Observable.of({type: commentActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() updateComment: Observable<Action> = this.actions
    .ofType(commentActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Komentář byl úspěšně editován.', COMMENTS);
        return {type: commentActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se editovat komentář. Kliknutím aktualizujete stránku.', COMMENTS);
        return Observable.of({type: commentActions.API_UPDATE_FAIL, payload: body.json()})
      }));
}