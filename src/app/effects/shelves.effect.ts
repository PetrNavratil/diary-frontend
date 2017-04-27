import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { shelvesActions }from '../reducers/shelves.reducer';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';
import { ToastrService } from '../shared/toastr.service';

const API_ENDPOINT = '/shelves';
const SHELVES = 'Polička';
@Injectable()
export class ShelvesEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {

  }

  @Effect() getShelves: Observable<Action> = this.actions
    .ofType(shelvesActions.API_GET)
    .switchMap((action) => this.http.get(environment.apiUrl + API_ENDPOINT, createOptions())
      .map(body => ({type: shelvesActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se načíst poličky. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() addShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_CREATE)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Polička byla úspěšně přidána.', SHELVES);
        return {type: shelvesActions.CREATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se přidat poličku. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_CREATE_FAIL, payload: body.json()})
      }));

  @Effect() addBookToShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_ADD_BOOK)
    .switchMap((action) => this.http.post(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload.book, createOptions())
      .map(body => {
        this.toastr.showSuccess('Kniha byla úspěšně přidána do poličky.', SHELVES);
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se přidat knihu do poličky. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  @Effect() removeBookFromShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_REMOVE_BOOK)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id + '/' + action.payload.book.id, createOptions())
      .map(body => {
        this.toastr.showSuccess('Kniha byla úspěšně odebrána z poličky.', SHELVES);
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se odebrat knihu z poličky. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  @Effect() removeShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_DELETE)
    .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, createOptions())
      .map(body => {
        this.toastr.showSuccess('Polička byla úspěšně odebrána.', SHELVES);
        return {type: shelvesActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se odebrat poličku. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() updateShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.API_UPDATE)
    .switchMap((action) => this.http.put(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, action.payload, createOptions())
      .map(body => {
        this.toastr.showSuccess('Polička byla úspěšně editována.', SHELVES);
        return {type: shelvesActions.UPDATE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Nepodařilo se editovat. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.API_UPDATE_FAIL, payload: body.json()})
      }));

  @Effect() copyShelf: Observable<Action> = this.actions
    .ofType(shelvesActions.ADDITIONAL.API_COPY)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/copy`, {}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Polička byla úspěšně zkopírována mezi vaše poličky.', SHELVES);
        return {type: shelvesActions.ADDITIONAL.COPY}
      })
      .catch(body => {
        this.toastr.showError('Poličku se nepodařilo zkopírovat. Kliknutím aktualizujete stránku.', SHELVES);
        return Observable.of({type: shelvesActions.ADDITIONAL.COPY})
      }));
}