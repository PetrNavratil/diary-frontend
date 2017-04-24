import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Http } from '@angular/http';
import { ToastrService } from '../shared/toastr.service';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { requestActions } from '../reducers/friend-request.reducer';
import { environment } from '../../environments/environment';
import { createOptions } from '../shared/createOptions';

const API_ENDPOINT = '/friends/requests';
const ACCEPT = 'accept';
const DECLINE = 'decline';
const REQUEST = 'Žádost o přátelství';

@Injectable()
export class RequestEffect {

  constructor(private actions: Actions, private http: Http, private toastr: ToastrService) {

  }

  @Effect() getRequests: Observable<Action> = this.actions
    .ofType(requestActions.API_GET)
    .switchMap((action) => this.http.get(`${environment.apiUrl}${API_ENDPOINT}`, createOptions())
      .map(body => ({type: requestActions.GET, payload: body.json()}))
      .catch(body => {
        this.toastr.showError('Nepodařilo se získat žádosti o přátelství. Kliknutím aktualizujete stránku.', REQUEST);
        return Observable.of({type: requestActions.API_GET_FAIL, payload: body.json()})
      }));

  @Effect() addRequest: Observable<Action> = this.actions
    .ofType(requestActions.API_CREATE)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Žádost byla úspěšně odeslána.', REQUEST);
        return {type: 'NOOP', payload: {}}
      })
      .catch(body => {
        this.toastr.showError('Žádost se nepodařilo odeslat. Kliknutím aktualizujete stránku.', REQUEST);
        return Observable.of({type: requestActions.API_CREATE_FAIL, payload: body.json()})
      }));

  @Effect() declineRequest: Observable<Action> = this.actions
    .ofType(requestActions.ADDITIONAL.ACCEPT)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/${DECLINE}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Žádost byla odmítnuta.', REQUEST);
        return {type: requestActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Žádost se nepodařilo odeslat. Kliknutím aktualizujete stránku.', REQUEST);
        return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
      }));

  @Effect() acceptRequest: Observable<Action> = this.actions
    .ofType(requestActions.ADDITIONAL.ACCEPT)
    .switchMap((action) => this.http.post(`${environment.apiUrl}${API_ENDPOINT}/${action.payload}/${ACCEPT}`,{}, createOptions())
      .map(body => {
        this.toastr.showSuccess('Žádost byla přijata.', REQUEST);
        return {type: requestActions.DELETE, payload: body.json()}
      })
      .catch(body => {
        this.toastr.showError('Žádost se nepodařilo odeslat. Kliknutím aktualizujete stránku.', REQUEST);
        return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
      }));

  // @Effect() removeReques: Observable<Action> = this.actions
  //   .ofType(requestActions.API_DELETE)
  //   .switchMap((action) => this.http.delete(environment.apiUrl + API_ENDPOINT + '/' + action.payload.id, createOptions())
  //     .map(body => {
  //       this.toastr.showSuccess('Komentář byl úspěšně odebrán.', REQUEST);
  //       return {type: requestActions.DELETE, payload: body.json()}
  //     })
  //     .catch(body => {
  //       this.toastr.showError('Nepodařilo se smazat komentář. Kliknutím aktualizujete stránku.', REQUEST);
  //       return Observable.of({type: requestActions.API_DELETE_FAIL, payload: body.json()})
  //     }));

}